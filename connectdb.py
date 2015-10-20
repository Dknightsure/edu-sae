#coding:utf-8
import MySQLdb
from flask import g
from sae.const import (MYSQL_HOST, MYSQL_HOST_S,MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB)


#   链接数据库
def connect_db():
    g.db = MySQLdb.connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASS,MYSQL_DB, port=int(MYSQL_PORT), charset="utf8")


#   断开数据库链接
def disconnect_db():
    if hasattr(g, 'db'):
        g.db.close()
