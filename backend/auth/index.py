import json
import os
from typing import Dict, Any
import hashlib
import secrets

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Авторизация администратора для доступа к редактору героев
    Args: event с httpMethod, body (login, password)
    Returns: JSON с токеном доступа или ошибкой
    '''
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
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        login = body_data.get('login', '').strip()
        password = body_data.get('password', '').strip()
        
        admin_login = os.environ.get('ADMIN_LOGIN', 'admin')
        admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
        
        if not login or not password:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Логин и пароль обязательны'})
            }
        
        if login == admin_login and password == admin_password:
            token = secrets.token_urlsafe(32)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'token': token,
                    'message': 'Авторизация успешна'
                })
            }
        else:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный логин или пароль'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка авторизации: {str(e)}'})
        }
