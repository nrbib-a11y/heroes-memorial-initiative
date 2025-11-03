import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления монументами и памятниками
    Args: event с httpMethod, body, queryStringParameters
    Returns: JSON с монументами или статусом операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            monument_id = params.get('id')
            
            if monument_id:
                safe_id = str(monument_id).replace("'", "''")
                cur.execute(
                    f"SELECT id, name, type, description, location, settlement, address, coordinates, establishment_year, architect, image_url, history FROM t_p26485321_heroes_memorial_init.monuments WHERE id = '{safe_id}'"
                )
                row = cur.fetchone()
                if row:
                    monument = {
                        'id': row[0],
                        'name': row[1],
                        'type': row[2],
                        'description': row[3],
                        'location': row[4],
                        'settlement': row[5],
                        'address': row[6],
                        'coordinates': row[7],
                        'establishmentYear': row[8],
                        'architect': row[9],
                        'imageUrl': row[10],
                        'history': row[11]
                    }
                    
                    cur.execute(
                        f"SELECT id, title, photo_url, description, photo_year FROM t_p26485321_heroes_memorial_init.monument_photos WHERE monument_id = '{safe_id}' ORDER BY upload_date DESC"
                    )
                    photos = []
                    for photo_row in cur.fetchall():
                        photos.append({
                            'id': photo_row[0],
                            'title': photo_row[1],
                            'photoUrl': photo_row[2],
                            'description': photo_row[3],
                            'photoYear': photo_row[4]
                        })
                    monument['photos'] = photos
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(monument),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Monument not found'}),
                        'isBase64Encoded': False
                    }
            else:
                cur.execute('SELECT id, name, type, description, location, settlement, address, coordinates, establishment_year, architect, image_url, history FROM t_p26485321_heroes_memorial_init.monuments ORDER BY id')
                rows = cur.fetchall()
                monuments = [{
                    'id': row[0],
                    'name': row[1],
                    'type': row[2],
                    'description': row[3],
                    'location': row[4],
                    'settlement': row[5],
                    'address': row[6],
                    'coordinates': row[7],
                    'establishmentYear': row[8],
                    'architect': row[9],
                    'imageUrl': row[10],
                    'history': row[11]
                } for row in rows]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'monuments': monuments}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            name = str(body_data.get('name', '')).replace("'", "''")
            monument_type = str(body_data.get('type', '')).replace("'", "''")
            description = str(body_data.get('description', '')).replace("'", "''")
            location = str(body_data.get('location', '')).replace("'", "''")
            settlement = str(body_data.get('settlement', '')).replace("'", "''")
            address = str(body_data.get('address', '')).replace("'", "''")
            coordinates = str(body_data.get('coordinates', '')).replace("'", "''") if body_data.get('coordinates') else 'NULL'
            establishment_year = body_data.get('establishmentYear', 'NULL')
            architect = str(body_data.get('architect', '')).replace("'", "''") if body_data.get('architect') else 'NULL'
            image_url = str(body_data.get('imageUrl', '')).replace("'", "''") if body_data.get('imageUrl') else 'NULL'
            history = str(body_data.get('history', '')).replace("'", "''") if body_data.get('history') else 'NULL'
            
            if coordinates == 'NULL':
                coordinates_sql = 'NULL'
            else:
                coordinates_sql = f"'{coordinates}'"
            
            if architect == 'NULL':
                architect_sql = 'NULL'
            else:
                architect_sql = f"'{architect}'"
                
            if image_url == 'NULL':
                image_url_sql = 'NULL'
            else:
                image_url_sql = f"'{image_url}'"
                
            if history == 'NULL':
                history_sql = 'NULL'
            else:
                history_sql = f"'{history}'"
            
            cur.execute(
                f"INSERT INTO t_p26485321_heroes_memorial_init.monuments (name, type, description, location, settlement, address, coordinates, establishment_year, architect, image_url, history) VALUES ('{name}', '{monument_type}', '{description}', '{location}', '{settlement}', '{address}', {coordinates_sql}, {establishment_year}, {architect_sql}, {image_url_sql}, {history_sql}) RETURNING id"
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': new_id, 'message': 'Monument created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            monument_id = body_data.get('id')
            
            if not monument_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID required'}),
                    'isBase64Encoded': False
                }
            
            name = str(body_data.get('name', '')).replace("'", "''")
            monument_type = str(body_data.get('type', '')).replace("'", "''")
            description = str(body_data.get('description', '')).replace("'", "''")
            location = str(body_data.get('location', '')).replace("'", "''")
            settlement = str(body_data.get('settlement', '')).replace("'", "''")
            address = str(body_data.get('address', '')).replace("'", "''")
            coordinates = str(body_data.get('coordinates', '')).replace("'", "''") if body_data.get('coordinates') else 'NULL'
            establishment_year = body_data.get('establishmentYear', 'NULL')
            architect = str(body_data.get('architect', '')).replace("'", "''") if body_data.get('architect') else 'NULL'
            image_url = str(body_data.get('imageUrl', '')).replace("'", "''") if body_data.get('imageUrl') else 'NULL'
            history = str(body_data.get('history', '')).replace("'", "''") if body_data.get('history') else 'NULL'
            safe_id = str(monument_id).replace("'", "''")
            
            if coordinates == 'NULL':
                coordinates_sql = 'NULL'
            else:
                coordinates_sql = f"'{coordinates}'"
            
            if architect == 'NULL':
                architect_sql = 'NULL'
            else:
                architect_sql = f"'{architect}'"
                
            if image_url == 'NULL':
                image_url_sql = 'NULL'
            else:
                image_url_sql = f"'{image_url}'"
                
            if history == 'NULL':
                history_sql = 'NULL'
            else:
                history_sql = f"'{history}'"
            
            cur.execute(
                f"UPDATE t_p26485321_heroes_memorial_init.monuments SET name = '{name}', type = '{monument_type}', description = '{description}', location = '{location}', settlement = '{settlement}', address = '{address}', coordinates = {coordinates_sql}, establishment_year = {establishment_year}, architect = {architect_sql}, image_url = {image_url_sql}, history = {history_sql}, updated_at = CURRENT_TIMESTAMP WHERE id = '{safe_id}'"
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Monument updated'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            monument_id = params.get('id')
            
            if not monument_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID required'}),
                    'isBase64Encoded': False
                }
            
            safe_id = str(monument_id).replace("'", "''")
            cur.execute(f"DELETE FROM t_p26485321_heroes_memorial_init.monument_photos WHERE monument_id = '{safe_id}'")
            cur.execute(f"DELETE FROM t_p26485321_heroes_memorial_init.monuments WHERE id = '{safe_id}'")
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Monument deleted'}),
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
