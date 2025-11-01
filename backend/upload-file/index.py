import json
import os
import base64
import boto3
from datetime import datetime
from typing import Dict, Any
import uuid

def get_s3_client():
    return boto3.client(
        's3',
        endpoint_url='https://storage.yandexcloud.net',
        aws_access_key_id=os.environ.get('S3_ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('S3_SECRET_ACCESS_KEY'),
        region_name='ru-central1'
    )

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Загрузка фотографий и документов героев в S3 хранилище
    Args: event с httpMethod, body (base64 файл, filename, contentType)
    Returns: JSON с URL загруженного файла
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
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
        
        file_data = body_data.get('file')
        filename = body_data.get('filename', 'unknown')
        content_type = body_data.get('contentType', 'application/octet-stream')
        folder = body_data.get('folder', 'general')
        
        if not file_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'File data is required'})
            }
        
        file_bytes = base64.b64decode(file_data)
        
        file_ext = filename.split('.')[-1] if '.' in filename else 'jpg'
        unique_filename = f"{folder}/{datetime.now().strftime('%Y%m%d')}_{uuid.uuid4().hex[:8]}.{file_ext}"
        
        bucket_name = os.environ.get('S3_BUCKET_NAME')
        s3_client = get_s3_client()
        
        s3_client.put_object(
            Bucket=bucket_name,
            Key=unique_filename,
            Body=file_bytes,
            ContentType=content_type,
            ACL='public-read'
        )
        
        file_url = f"https://storage.yandexcloud.net/{bucket_name}/{unique_filename}"
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'url': file_url,
                'filename': unique_filename,
                'message': 'File uploaded successfully'
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Upload failed: {str(e)}'})
        }
