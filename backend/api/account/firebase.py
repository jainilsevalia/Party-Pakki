import os

import firebase_admin
from django.contrib.auth import get_user_model
from firebase_admin import auth
from firebase_admin import credentials
from rest_framework import authentication

from .exceptions import FirebaseError
from .exceptions import InvalidAuthToken

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from urllib.request import urlopen

import uuid

cred = credentials.Certificate(
    {
        "type": "service_account",
        "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
        "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": os.environ.get("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
        "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_CERT_URL"),
    }
)

default_app = firebase_admin.initialize_app(cred)


class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            return None

        id_token = auth_header.split(" ").pop()
        decoded_token = None
        try:
            decoded_token = auth.verify_id_token(id_token)
        except Exception:
            raise InvalidAuthToken("Invalid auth token")

        if not id_token or not decoded_token:
            return None

        provider = decoded_token["firebase"]["sign_in_provider"]
        if provider !=  "phone" :
            try:
                email = decoded_token.get("email")
                user, created = get_user_model().objects.get_or_create(email=email)
            except Exception:
                raise FirebaseError()
        else:
            phone_number = decoded_token.get("phone_number")
            user, created = get_user_model().objects.get_or_create(phone_number=phone_number)

        if created:
            name = decoded_token.get("name")
            if(name and len(name.split(" ")) > 1):
                user.profile.first_name = name.split(" ")[0]
                user.profile.last_name = name.split(" ")[1]
            else:
                user.profile.first_name = name

            photo = decoded_token.get("picture")
            if photo:
                img_temp = NamedTemporaryFile()
                img_temp.write(urlopen(photo).read())
                img_temp.flush()
                img_name = uuid.uuid4().hex
                user.profile.photo.save(img_name, File(img_temp))

            user.profile.save()
            
            user.is_verified = decoded_token.get("email_verified", False)
            user.verified_through = "phone" if provider == "phone" else "email"

            user.save()



        return (user, None)