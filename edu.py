#coding:utf-8
from flask import Flask, render_template, request, session, g, redirect, url_for, flash
from connectdb import connect_db, disconnect_db
import json
import teacher
import student

app = Flask(__name__)
app.secret_key = 'hushuo'


#  ************************
#   登录页&首页
#  ************************
@app.route('/', methods=['GET', 'POST'])
def index():
    if 'userid' in session:
        return login(session['what'], session['userid'], session['userpwd'])
    if request.method == 'POST':
        return login(request.form['stuOrTeacher'], request.form['inputUser'], request.form['inputPassword'])
    else:
        return render_template('index.html')


#  ************************
#   返回用户基本信息json格式
#  ************************
@app.route('/find_person_info_json')
def show_person_info_json():
    if 'userid' in session:
        if session['what'] == 'student':
            return json.dumps(student.get_info(session['userid']))
        else:
            return json.dumps(teacher.get_info(session['userid']))
    else:
        return redirect(url_for('index'))


#   ************************
#       student function
#   ************************

#   返回学生已选课程的json数据
@app.route('/choosedcourse_json')
def show_choosed_course_json():
    if 'userid' in session:
        return json.dumps(student.get_choosed_course(session['userid']))
    else:
        return redirect(url_for('index'))


#   返回学生未选课程的json数据
@app.route('/find_unchoosedcourse_json')
def find_unchoosedcourse_json():
    if 'userid' in session:
        return json.dumps(student.get_unchoosed_course(session['userid']))
    else:
        return redirect(url_for('index'))


#   学生选择课程处理（插入数据）
#   session['userid'] ：用户id, string
#   request.form['checkcourse_id'] : 课程id列表, json string
@app.route('/to_choose_course', methods=['POST'])
def to_choose_course():
    if request.method == 'POST' and 'userid' in session:
        return student.choose_course(session['userid'], json.loads(request.form['checkcourse_id']))


#   学生退选课程处理（删除数据）
#   session['userid'] ：用户id, string
#   request.form['checkcourse_id'] : 课程id列表, json string
@app.route('/to_unchoose_course', methods=['POST'])
def to_unchoose_course():
    if request.method == 'POST' and 'userid' in session:
        return student.unchoose_course(session['userid'], json.loads(request.form['checkcourse_id']))


#   ************************
#       teacher function
#   ************************

#   返回某门课程的选课学生名单的json数据
#   request.form['course_id'] : 课程id, string
@app.route("/show_my_student", methods=['POST'])
def show_my_student():
    if 'userid' in session and request.method == 'POST':
        return json.dumps(teacher.show_student_by_courseid(request.form['course_id']))


#   教师录入分数处理（更新数据）
#   request.form['cou_id'] : 课程id, json string
#   request.form['id'] : 学生id列表, json string
#   request.form['score'] : 学生分数列表, json string
@app.route('/input_score', methods=['POST'])
def input_score():
    if 'userid' in session and request.method == 'POST':
        return teacher.submit_score(json.loads(request.form['cou_id']), json.loads(request.form["id"]), json.loads(request.form["score"]))


#   教师停止某门课程的发布（删除数据）
#   request.form['course_id'] : 课程id列表, json string
@app.route('/un_publish_course', methods=['POST'])
def un_publish_course():
    if request.method == 'POST' and 'userid' in session:
        return teacher.unpublish_course(session['userid'], json.loads(request.form['course_id']))


#   教师发布新课程（添加数据）
#   request.form['data'] : 课程信息, json string
@app.route('/publish_new_course', methods=['POST'])
def publish_new_course():
    if request.method == 'POST' and 'userid' in session:
        return teacher.publish_course(session['userid'], json.loads(request.form['data']))


#   返回教师已发布课程的json数据
@app.route('/find_publishedcourse_json')
def show_publishedcourse_json():
    if 'userid' in session:
        return json.dumps(teacher.get_published_course(session['userid']))
    else:
        return redirect(url_for('index'))


#   ***************************
#        common function
#   ***************************
#   发送request前,链接数据库
@app.before_request
def before_request():
    connect_db()


#   断开request后，断开数据库
@app.teardown_request
def teardown_request(exception):
    disconnect_db()


#   登出
@app.route('/signout')
def logout():
    session.pop('userid', None)
    session.pop('what', None)
    session.pop('userpwd', None)
    return redirect(url_for('index'))


#   用户登录（学生，教师）
def login(who, id, pwd):
    cursor = g.db.cursor()
    table = 't_teacher'
    if who == 'student':
        table = 't_student'
    sqlcmd = 'select name from %s where id="%s" and password="%s"'%(table, id, pwd)
    cursor.execute(sqlcmd)
    rs = cursor.fetchone()
    cursor.close()
    if rs is not None:
        session['userid'] = id
        session['userpwd'] = pwd
        if who == 'student':
            session['what'] = 'student'
            return render_template('studentContent.html')
        else:
            session['what'] = 'teacher'
            return render_template('teacherContent.html')
    else:
        flash('用户ID或者密码不正确！')
        return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)
