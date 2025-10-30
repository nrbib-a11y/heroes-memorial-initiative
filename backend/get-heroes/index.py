"""
Business: Get heroes list with filtering and search
Args: event with httpMethod, queryStringParameters for search/filter
Returns: JSON list of heroes with their basic info
"""
import json
import os
import psycopg2
from typing import Dict, Any, List, Optional


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
    search_query = params.get('search', '').strip()
    filter_rank = params.get('rank', '').strip()
    filter_district = params.get('district', '').strip()
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration error'})
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    query = """
        SELECT 
            h.id,
            h.full_name,
            h.birth_year,
            h.death_year,
            h.rank,
            h.military_unit,
            h.hometown,
            h.district,
            COALESCE(
                json_agg(
                    DISTINCT a.award_name
                    ORDER BY a.award_name
                ) FILTER (WHERE a.award_name IS NOT NULL),
                '[]'
            ) as awards
        FROM heroes h
        LEFT JOIN awards a ON h.id = a.hero_id
        WHERE 1=1
    """
    
    conditions = []
    if search_query:
        conditions.append(f"(LOWER(h.full_name) LIKE LOWER('%{search_query}%') OR LOWER(h.military_unit) LIKE LOWER('%{search_query}%') OR LOWER(h.hometown) LIKE LOWER('%{search_query}%'))")
    
    if filter_rank:
        conditions.append(f"h.rank = '{filter_rank}'")
    
    if filter_district:
        conditions.append(f"h.district = '{filter_district}'")
    
    if conditions:
        query += " AND " + " AND ".join(conditions)
    
    query += " GROUP BY h.id ORDER BY h.full_name"
    
    cur.execute(query)
    rows = cur.fetchall()
    
    heroes: List[Dict[str, Any]] = []
    for row in rows:
        hero = {
            'id': row[0],
            'name': row[1],
            'birthYear': row[2],
            'deathYear': row[3],
            'rank': row[4],
            'unit': row[5],
            'hometown': row[6],
            'region': row[7],
            'awards': row[8] if row[8] else []
        }
        heroes.append(hero)
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(heroes, ensure_ascii=False)
    }
