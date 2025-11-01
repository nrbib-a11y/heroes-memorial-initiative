'''
Business: Upload and manage files for heroes (photos and documents)
Args: event with httpMethod, body (file data in base64), headers (X-Auth-Token)
Returns: HTTP response with file URL or list of files
'''

import json
import jwt
import base64
import uuid
import os
import psycopg2
from typing import Dict, Any

SECRET_KEY = "neklinovsky_heroes_secret_2024"
DATABASE_URL = os.environ.get('DATABASE_URL', '')

def verify_token(token: str) -> bool:
    try:
        jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return True
    except:
        return False

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    auth_token = event.get('headers', {}).get('X-Auth-Token', '')
    
    if method in ['POST', 'DELETE'] and not verify_token(auth_token):
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            hero_id = params.get('hero_id')
            
            if hero_id:
                cursor.execute(
                    "SELECT id, hero_id, file_name, file_type, file_url, uploaded_at FROM hero_files WHERE hero_id = %s ORDER BY uploaded_at DESC",
                    (hero_id,)
                )
            else:
                cursor.execute(
                    "SELECT id, hero_id, file_name, file_type, file_url, uploaded_at FROM hero_files ORDER BY uploaded_at DESC"
                )
            
            rows = cursor.fetchall()
            files = [{
                'id': row[0],
                'hero_id': row[1],
                'file_name': row[2],
                'file_type': row[3],
                'file_url': row[4],
                'uploaded_at': row[5].isoformat() if row[5] else None
            } for row in rows]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(files)
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            hero_id = body_data.get('hero_id')
            file_name = body_data.get('file_name')
            file_type = body_data.get('file_type')
            file_data = body_data.get('file_data')
            
            if not all([hero_id, file_name, file_type, file_data]):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            file_id = str(uuid.uuid4())
            file_url = f"/files/{file_id}_{file_name}"
            
            cursor.execute(
                "INSERT INTO hero_files (hero_id, file_name, file_type, file_url, file_data) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (hero_id, file_name, file_type, file_url, file_data)
            )
            
            new_id = cursor.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'id': new_id,
                    'hero_id': hero_id,
                    'file_name': file_name,
                    'file_type': file_type,
                    'file_url': file_url
                })
            }
        
        if method == 'DELETE':
            params = event.get('queryStringParameters', {})
            file_id = params.get('id')
            
            if not file_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Missing file ID'})
                }
            
            cursor.execute("DELETE FROM hero_files WHERE id = %s", (file_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
    
    finally:
        cursor.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
