from storages.backends.s3boto3 import S3Boto3Storage


class StaticStorage(S3Boto3Storage):
    location = 'partypakki_/static'
    default_acl = 'public-read'


class PublicMediaStorage(S3Boto3Storage):
    location = 'partypakki_/media'
    file_overwrite = True
