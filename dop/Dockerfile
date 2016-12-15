FROM python:2.7

ADD requirements.txt /opt/django/app/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r /opt/django/app/requirements.txt

RUN apt-get update 

ADD dockerizing/server/bash/start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh

RUN touch /var/log/post_uwsgi.log
RUN touch /var/log/post_access.log
RUN touch /var/log/post_error.log

RUN mkdir /usr/src/dop
WORKDIR /usr/src/dop

CMD /usr/bin/start.sh