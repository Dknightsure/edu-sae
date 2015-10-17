#coding:utf-8
from flask import session, request, redirect, url_for, g
import json


#   提交分数（处理请求）
#   course_id : 课程id, string
#   student_id_arr : 学生id列表, list
#   score_arr : 学生分数列表, list
def submit_score(course_id, student_id_arr, score_arr):
    cursor = g.db.cursor()
    for student_id, student_score in zip(student_id_arr, score_arr):
        sqlcmd = 'update t_choosecourse set score=%s where student_id="%s" and course_id="%s"'%(student_score, student_id, course_id)
        cursor.execute(sqlcmd)
    g.db.commit()
    cursor.close()
    return "success"


#   返回选课学生的数据（处理请求）
#   course_id : 课程id, string
#   return : [(id, name, gender, location, score)], list
def show_student_by_courseid(course_id):
    cursor = g.db.cursor()
    sqlcmd = 'select s.id, s.name, s.gender, s.location, cs.score from t_student as s, t_choosecourse as cs where s.id in (select student_id from t_choosecourse where course_id="%s") and s.id=cs.student_id and cs.course_id="%s"'%(course_id, course_id)
    cursor.execute(sqlcmd)
    rs = cursor.fetchall()
    cursor.close()
    return rs


#   停止发布某门课程（处理请求）
#   teacher_id : 教师id, string
#   course_id_arr : 课程id列表, list
def unpublish_course(teacher_id, course_id_arr):
    cursor = g.db.cursor()
    for cou in course_id_arr:
        sqlcmd = 'delete from t_choosecourse where course_id="%s"'%cou
        cursor.execute(sqlcmd)
        sqlcmd = 'delete from t_publishcourse where course_id="%s" and teacher_id="%s"'%(cou, teacher_id)
        cursor.execute(sqlcmd)
        sqlcmd = 'delete from t_course where id="%s"'%cou
        cursor.execute(sqlcmd)
    g.db.commit()
    cursor.close()
    return ""


#   发布某门课程（处理请求）
#   teacher_id : 教师id, string
#   course_info : 课程信息, map,{id,name,time,address}
def publish_course(teacher_id, course_info):
    try:
        cursor = g.db.cursor()
        sqlcmd = "insert into t_course values('%(id)s', '%(name)s', '%(time)s', '%(address)s')"%course_info
        cursor.execute(sqlcmd)
        sqlcmd = "insert into t_publishcourse values('%s', '%s')"%(teacher_id, course_info['id'])
        cursor.execute(sqlcmd)
        cursor.close()
        g.db.commit()
        return ""
    except Exception as e:
        g.db.rollback()
        return "duplicate"


#   返回教师个人信息
def get_info(id):
    sqlcmd = "select id, name, gender, location from t_teacher where id='%s';"%id
    cursor = g.db.cursor()
    cursor.execute(sqlcmd)
    rs = cursor.fetchall()
    rs = rs[0]
    cursor.close()
    return rs


#   返回教师已发布课程
def get_published_course(userid):
    sqlcmd = "select * from t_course where id in (select course_id from t_publishcourse where teacher_id='%s');"%userid
    cursor = g.db.cursor()
    cursor.execute(sqlcmd)
    rs = cursor.fetchall()
    cursor.close()
    return rs
