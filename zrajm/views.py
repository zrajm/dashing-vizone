# -*- encoding: utf-8 -*-

############################################################################
##                                                                        ##
##  Zrajm's Stuff Below                                                   ##
##                                                                        ##
############################################################################

from django.http import HttpResponse
import datetime

def current_datetime(request):
    now = datetime.datetime.now()
    html = "<html><body>%s</body></html>" % now
    return HttpResponse(html)

#[eof]
