#coding:utf-8
from flask import redirect, request, session, url_for, g
import json


#   退选课程（处理请求）
#   student_id : 选课学生ID, string
#   course_id_arr : 课程ID列表, list
def unchoose_course(student_id, course_id_arr):
    cursor = g.db.cursor()
    for cou in course_id_arr:
        sqlcmd = "delete from t_choosecourse where student_id='%s' and course_id='%s'"%(student_id, cou)
        cursor.execute(sqlcmd)
    g.db.commit()
    cursor.close()
    return ""


#   选择课程（处理请求）
#   student_id : 选课学生ID, string
#   course_id_arr : 课程ID列表, list
def choose_course(student_id, course_id_arr):
    cursor = g.db.cursor()
    for cou in course_id_arr:
        sqlcmd = "insert into t_choosecourse(student_id, course_id) values('%s', '%s')"%(student_id, cou)
        cursor.execute(sqlcmd)
    g.db.commit()
    cursor.close()
    return ""


#   返回学生个人信息
def get_info(id):
    sqlcmd = "select id, name, gender, location from t_student where id='%s';"%id
    cursor = g.db.cursor()
    cursor.execute(sqlcmd)
    rs = cursor.fetchall()
    rs = rs[0]
    cursor.close()
    return rs


#   返回学生选择的课程
def get_choosed_course(userid):
    sqlcmd = "select c.id, c.name, c.time, c.address, cc.score from t_course as c, t_choosecourse as cc where c.id in (select course_id from t_choosecourse where student_id='%s') and c.id=cc.course_id and cc.student_id='%s';"%(userid, userid)
    cursor = g.db.cursor()
    cursor.execute(sqlcmd)
    rs = cursor.fetchall()
    cursor.close()
    return rs


#   返回学生可选课程
def get_unchoosed_course(userid):
    sqlcmd = "select id, name, time, address from t_course where id not in (select course_id from t_choosecourse where student_id='%s');"%userid
    cursor = g.db.cursor()
    cursor.execute(sqlcmd)
    rs = cursor.fetchall()
    cursor.close()
    return rs


