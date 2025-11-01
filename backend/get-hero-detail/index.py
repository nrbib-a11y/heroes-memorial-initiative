"""
Business: Get detailed hero information by ID
Args: event with pathParams containing hero ID
Returns: JSON with full hero data including awards, military path, documents
"""
import json
import os
import psycopg2
from typing import Dict, Any, Optional


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters') or {}
    hero_id = params.get('id')
    
    if not hero_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Hero ID is required'})
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
        SELECT id, full_name, birth_year, birth_place, death_year, death_place,
               rank, military_unit, hometown, district, biography
        FROM heroes
        WHERE id = %s
    """, (hero_id,))
    
    hero_row = cur.fetchone()
    
    if not hero_row:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Hero not found'})
        }
    
    hero = {
        'id': hero_row[0],
        'name': hero_row[1],
        'birthYear': hero_row[2],
        'birthPlace': hero_row[3],
        'deathYear': hero_row[4],
        'deathPlace': hero_row[5],
        'rank': hero_row[6],
        'unit': hero_row[7],
        'hometown': hero_row[8],
        'region': hero_row[9],
        'biography': hero_row[10]
    }
    
    cur.execute("""
        SELECT award_name, award_date
        FROM awards
        WHERE hero_id = %s
        ORDER BY award_date
    """, (hero_id,))
    
    awards = [row[0] for row in cur.fetchall()]
    hero['awards'] = awards
    
    cur.execute("""
        SELECT event_date, event_description
        FROM military_path
        WHERE hero_id = %s
        ORDER BY sort_order, id
    """, (hero_id,))
    
    military_path = [{'date': row[0], 'event': row[1]} for row in cur.fetchall()]
    hero['militaryPath'] = military_path
    
    cur.execute("""
        SELECT document_type, document_description, document_date
        FROM documents
        WHERE hero_id = %s
        ORDER BY id
    """, (hero_id,))
    
    documents = [{'type': row[0], 'description': row[1], 'date': row[2]} for row in cur.fetchall()]
    hero['documents'] = documents
    
    cur.execute("""
        SELECT photo_url, photo_description, photo_year
        FROM photos
        WHERE hero_id = %s
        ORDER BY photo_year
    """, (hero_id,))
    
    photos = [{'url': row[0], 'description': row[1], 'year': row[2]} for row in cur.fetchall()]
    hero['photos'] = photos
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(hero, ensure_ascii=False)
    }
