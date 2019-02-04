import random
import json

from botocore.vendored import requests

GITHUB_RAW_URI = "https://raw.githubusercontent.com/afreeorange/developer-excuses/master/excuses.txt"
META_EXCUSE = "I couldn't generate an excuse. Something's wrong in the Cloud. I understand what this looks like."
DEFAULT_RETURN_TYPE = "text/plain"


def _respond(message, accept_headers, code=200):
    if "application/json" in accept_headers.lower():
        message_body = json.dumps({
            "message": message,
        })
        response_content_type = "application/json"
        
    else:
        message_body = message + '\n'
        response_content_type = DEFAULT_RETURN_TYPE

    return {
        "headers": {
            "Content-Type": response_content_type,
            "Access-Control-Allow-Origin": "*",
        },
        "statusCode": code,
        "body": message_body,
    }


def lambda_handler(event, context):
    accept_headers = DEFAULT_RETURN_TYPE
    if event.get('headers'):
        accept_headers = event.get('headers').get('Accept', DEFAULT_RETURN_TYPE)

    try:
        return _respond(
            message=random.choice(
                [
                    _ for
                    _ in requests.get(GITHUB_RAW_URI).text.split("\n")
                    if _.strip() is not ''
                ]
            ),
            accept_headers=accept_headers,
            code=200,
        )
    except Exception:
        return _respond(
            message=META_EXCUSE,
            accept_headers=accept_headers,
            code=500,
        )
