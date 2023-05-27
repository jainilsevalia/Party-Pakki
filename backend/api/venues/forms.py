from django.contrib.admin.widgets import RelatedFieldWidgetWrapper
from django.contrib.admin import site
from django.db.models.fields.reverse_related import OneToOneRel
from django import forms

from dal import autocomplete
from .models import Amenity, Location, Restaurant, Venue

class VenueForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["photos"] = forms.ImageField(widget=forms.ClearableFileInput(attrs={"multiple": True}))
        self.fields[
            "photos"
        ].help_text = "Upload multiple photos at once. If you already uploaded certain photos you can see previews below and can replace perticular image from there."

        if self.initial:
            self.fields["photos"].required = False

    class Meta:
        model = Venue
        fields = "__all__"


class RestaurantForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        rel = OneToOneRel(Restaurant.venue, Venue, "uuid")
        self.fields['venue'].widget = RelatedFieldWidgetWrapper(self.fields['venue'].widget, rel=rel, admin_site=site)
        self.fields["photos"] = forms.ImageField(widget=forms.ClearableFileInput(attrs={"multiple": True}))
        self.fields[
            "photos"
        ].help_text = "Upload multiple photos at once. If you already uploaded certain photos you can see previews below and can replace perticular image from there."

        self.fields["photos"].required = False

    class Meta:
        model = Restaurant
        fields = "__all__"

class LocationInlineForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        state = self.initial.get("state", None)
        if state:
            self.fields["state"].initial = state

        city = self.initial.get("city", None)
        if city:
            self.fields["city"].initial = city
    class Meta:
        model = Location
        fields = "__all__"
        widgets = {
            "state": autocomplete.ListSelect2(url="state-autocomplete", attrs={"data-placeholder": "Select a state"}),
            "city": autocomplete.ListSelect2(
                url="city-autocomplete", forward=["state"], attrs={"data-placeholder": "Select a city"}
            ),
        }

class AmenityInlineForm(forms.ModelForm):

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data['uuid'] == None:
            try:
                amenity = Amenity.objects.get(name=cleaned_data['name'], venue=cleaned_data['venue'])
            except:
                amenity = None
            
            if amenity:
                raise forms.ValidationError("Amenity already exists")
        else:
            if "name" in self.changed_data:
                try:
                    amenity = Amenity.objects.get(name=cleaned_data['name'], venue=cleaned_data['venue'])
                except:
                    amenity = None
                
                if amenity:
                    raise forms.ValidationError("Amenity already exists")
                
                    

        return cleaned_data

    class Meta:
        model = Amenity
        fields = "__all__"