
from django import forms

from api.account.models import Booking
from api.tasks import send_email
from core.settings import EMAIL_HOST_USER, FRONTEND_URL


class BookingAdminForm(forms.ModelForm):

    def clean(self):
        cleaned_data = super().clean()
        if "process_stage" in self.changed_data:
            process_stage = cleaned_data["process_stage"]
            if process_stage == "Confirmed":
                subject = "PartyPakki: Booking Confirmed"
                title = "Booking of {} has been confirmed".format(cleaned_data["venue"].name)
                message = """
                    Your booking of {venue_name} has been confirmed for the date {event_date}. For any queries feel free to contact us. Thank you for choosing PartyPakki.
                """.format(venue_name=cleaned_data["venue"].name, event_date=cleaned_data["event_date"])
            elif process_stage == "Cancelled":
                subject = "PartyPakki: Booking Cancelled"
                title = "Booking of {} has been cancelled".format(cleaned_data["venue"].name)
                message = """
                    Your booking of {venue_name} has been cancelled for the date {event_date}. For any queries feel free to contact us. Thank you for choosing PartyPakki.
                """.format(venue_name=cleaned_data["venue"].name, event_date=cleaned_data["event_date"])
            elif process_stage == "Completed":
                subject = "PartyPakki: Booking Completed"
                title = "Hooray! Event at {} has been completed successfully".format(cleaned_data["venue"].name)
                message = """
                    Thank you for choosing PartyPakki. We hope that you had a great experience at {venue_name} on {event_date}. Please provide your feedback and rating to help us serve you better. Click below button to give your feedback.
                """.format(venue_name=cleaned_data["venue"].name, event_date=cleaned_data["event_date"])

            if process_stage != "Requested":
                send_email({
                    "from": EMAIL_HOST_USER,
                    "to": [cleaned_data['user'].user.email],
                    "context": {
                        "subject": subject,
                        "title": title,
                        "message": message,
                        "action": "Visit website",
                        "action_link": FRONTEND_URL + "/profile/"
                    }
                })

        if "admin_remarks" in self.changed_data:
            subject = "PartyPakki: Reply regarding your booking request"
            title = "Reply for your booking request of {}".format(cleaned_data["venue"].name)
            message = """
                {admin_remarks}
            """.format(admin_remarks=cleaned_data["admin_remarks"])

            send_email({
                "from": EMAIL_HOST_USER,
                "to": [cleaned_data['user'].user.email],
                "context": {
                    "subject": subject,
                    "title": title,
                    "message": message,
                    "action": "Visit website",
                    "action_link": FRONTEND_URL + "/profile/"
                }
            })
        return cleaned_data

    class Meta:
        model = Booking
        fields = "__all__"