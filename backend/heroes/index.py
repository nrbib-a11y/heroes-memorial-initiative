import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления базой героев войны
    Args: event с httpMethod, body, queryStringParameters
    Returns: JSON с героями или статусом операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Max': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            hero_id = params.get('id')
            
            if hero_id:
                cur.execute(
                    'SELECT id, full_name, birth_year, death_year, rank, military_unit, hometown, district, photo_url, documents FROM heroes WHERE id = %s',
                    (hero_id,)
                )
                row = cur.fetchone()
                if row:
                    hero = {
                        'id': row[0],
                        'name': row[1],
                        'birthYear': row[2],
                        'deathYear': row[3],
                        'rank': row[4],
                        'unit': row[5],
                        'hometown': row[6],
                        'region': row[7],
                        'photo': row[8],
                        'documents': row[9] if row[9] else [],
                        'awards': []
                    }
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(hero),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Hero not found'}),
                        'isBase64Encoded': False
                    }
            else:
                cur.execute('SELECT id, full_name, birth_year, death_year, rank, military_unit, hometown, district, photo_url FROM heroes ORDER BY id')
                rows = cur.fetchall()
                heroes = [{
                    'id': row[0],
                    'name': row[1],
                    'birthYear': row[2],
                    'deathYear': row[3],
                    'rank': row[4],
                    'unit': row[5],
                    'hometown': row[6],
                    'region': row[7],
                    'photo': row[8],
                    'awards': []
                } for row in rows]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'heroes': heroes}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                '''INSERT INTO heroes (full_name, birth_year, death_year, rank, military_unit, hometown, district, photo_url, documents) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id''',
                (
                    body_data.get('name'),
                    body_data.get('birthYear'),
                    body_data.get('deathYear'),
                    body_data.get('rank'),
                    body_data.get('unit'),
                    body_data.get('hometown'),
                    body_data.get('region', 'Неклиновский район'),
                    body_data.get('photo'),
                    json.dumps(body_data.get('documents', []))
                )
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': new_id, 'message': 'Hero created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            hero_id = body_data.get('id')
            
            if not hero_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                '''UPDATE heroes SET full_name = %s, birth_year = %s, death_year = %s, 
                   rank = %s, military_unit = %s, hometown = %s, district = %s, 
                   photo_url = %s, documents = %s, updated_at = CURRENT_TIMESTAMP
                   WHERE id = %s''',
                (
                    body_data.get('name'),
                    body_data.get('birthYear'),
                    body_data.get('deathYear'),
                    body_data.get('rank'),
                    body_data.get('unit'),
                    body_data.get('hometown'),
                    body_data.get('region', 'Неклиновский район'),
                    body_data.get('photo'),
                    json.dumps(body_data.get('documents', [])),
                    hero_id
                )
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Hero updated'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            hero_id = params.get('id')
            
            if not hero_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('DELETE FROM heroes WHERE id = %s', (hero_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Hero deleted'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
