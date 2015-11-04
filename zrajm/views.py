# -*- encoding: utf-8 -*-

############################################################################
##                                                                        ##
##  Zrajm's Stuff Below                                                   ##
##                                                                        ##
############################################################################

from django.http import HttpResponse
import datetime

# Read mora about HttpResponse objects here:
# https://docs.djangoproject.com/en/1.8/ref/request-response/#httprequest-objects
# /zrajm [2015-11-04]

def current_datetime(request):
    now = datetime.datetime.now()
    text = "%s" % now
    return HttpResponse(text, content_type="text/plain")

#[eof]
