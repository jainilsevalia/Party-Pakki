from templated_email import get_templated_mail
from celery import shared_task
from core.settings import SEND_EMAIL


@shared_task
def send_email(data):
    if SEND_EMAIL == "True":
        email = get_templated_mail(
            template_name="basic",
            from_email=data["from"],
            to=data["to"],
            context=data["context"],
        )
        email.send()
    return None
