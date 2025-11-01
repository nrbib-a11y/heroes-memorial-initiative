"""
Business: Accept user submissions of hero materials and documents
Args: event with POST body containing submission data
Returns: Success confirmation
"""
import json
import os
import psycopg2
from typing import Dict, Any


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_str = event.get('body', '{}')
    body = json.loads(body_str)
    
    hero_name = body.get('heroName', '').strip()
    relationship = body.get('relationship', '').strip()
    document_type = body.get('documentType', '').strip()
    description = body.get('description', '').strip()
    year = body.get('year', '').strip()
    email = body.get('email', '').strip()
    
    if not hero_name or not email:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Hero name and email are required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration error'})
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO submissions 
        (hero_name, relationship, document_type, description, year, email, status)
        VALUES (%s, %s, %s, %s, %s, %s, 'pending')
        RETURNING id
    """, (hero_name, relationship, document_type, description, year, email))
    
    submission_id = cur.fetchone()[0]
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'submissionId': submission_id,
            'message': 'Материалы успешно отправлены на модерацию'
        }, ensure_ascii=False)
    }
