"""
Router principal de la aplicación
Maneja el enrutamiento de todas las peticiones a sus handlers correspondientes
"""

from handlers import auth, projects, tasks
from utils.response import error_response


def lambda_handler(event, context):
    """
    Handler principal que enruta todas las peticiones
    """
    
    try:
        method = event.get('httpMethod')
        path = event.get('path', '')
        
        # Manejar OPTIONS para CORS
        if method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                },
                'body': ''
            }
        
        print(f"Routing: {method} {path}")
        
        # ==================== AUTH ROUTES ====================
        if path == '/auth/register' and method == 'POST':
            return auth.register(event, context)
        
        if path == '/auth/login' and method == 'POST':
            return auth.login(event, context)
        
        if path == '/auth/me' and method == 'GET':
            return auth.get_profile(event, context)
        
        # ==================== PROJECT ROUTES ====================
        if path == '/projects':
            if method == 'GET':
                return projects.list_projects(event, context)
            elif method == 'POST':
                return projects.create_project_handler(event, context)
        
        if path.startswith('/projects/') and path.count('/') == 2:
            # /projects/{id}
            if method == 'GET':
                return projects.get_project_details(event, context)
            elif method == 'PUT':
                return projects.update_project_handler(event, context)
            elif method == 'DELETE':
                return projects.delete_project_handler(event, context)
        
        # ==================== TASK ROUTES ====================
        if '/tasks' in path:
            path_parts = path.split('/')
            
            # /projects/{id}/tasks
            if len(path_parts) == 4 and path_parts[3] == 'tasks':
                if method == 'GET':
                    return tasks.list_tasks(event, context)
                elif method == 'POST':
                    return tasks.create_task_handler(event, context)
            
            # /projects/{id}/tasks/{taskId}
            elif len(path_parts) == 5 and path_parts[3] == 'tasks':
                if method == 'PUT':
                    # Crear pathParameters si no existen
                    if 'pathParameters' not in event:
                        event['pathParameters'] = {}
                    # API Gateway envía 'id' como el project ID
                    event['pathParameters']['projectId'] = event['pathParameters'].get('id')
                    event['pathParameters']['taskId'] = path_parts[4]
                    return tasks.update_task_handler(event, context)
                elif method == 'DELETE':
                    # Crear pathParameters si no existen
                    if 'pathParameters' not in event:
                        event['pathParameters'] = {}
                    event['pathParameters']['projectId'] = event['pathParameters'].get('id')
                    event['pathParameters']['taskId'] = path_parts[4]
                    return tasks.delete_task_handler(event, context)
        
        # Ruta no encontrada
        return error_response(404, f'Ruta no encontrada: {method} {path}', 'NOT_FOUND')
        
    except Exception as e:
        print(f"Error en lambda_handler: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(500, 'Error interno del servidor', 'INTERNAL_ERROR')