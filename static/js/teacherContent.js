$(document).ready(function(){
            $("#publishedcourse").click(function(){
              $.get("/find_publishedcourse_json", function(data, status){
                  var publishedcourse = eval(data);
                  $(".mynav").removeClass("active");
                  var publishedTable = ' <table class="table table-bordered table-hover"><thead><tr><th>课编号</th><th>名称</th><th>上课时间</th><th>上课地点</th><th>选中</th></tr></thead><tbody>';
                  for(var i = 0; i < publishedcourse.length; i++){
                      publishedTable += "<tr>";
                      var course_id = publishedcourse[i][0];
                      for(var j = 0; j < publishedcourse[i].length; j++){
                          publishedTable += "<td>" + publishedcourse[i][j] + "</td>";
                      }
                      publishedTable += "<td>" + '<input type="checkbox" class="cou" name="publishedcourse" value="' + course_id + '">' + "</td>";
                      publishedTable += "</tr>";
                  }
                  publishedTable += "</tbody></table>";
                  publishedTable += '<div class="col-md-offset-11"> <button id="btn_unpublish_course" class="btn btn-primary">停止发布</button> </div>';
                  $("#mycontent").html(publishedTable);
                  $("#publishedcourse").addClass("active");

                  show_student();

                  $("#btn_unpublish_course").click(function(){
                      if($("input:checked").length == 0){
                          $("#dialog_info").find("p").text("请勾选课程！");
                          $("#dialog_info").modal("show");
                          return false;
                      }
                      $("#dialog_do_or_not").modal("show");
                      $("#btn_allow_to_do").unbind("click").click(function(){
                          var unpublish_course = [];
                          for(var i = 0; i < $("input:checked").length; i++){
                              unpublish_course.push($("input:checked")[i].value);
                          }
                          unpublish_course = JSON.stringify(unpublish_course);
                          $.post('/un_publish_course',{course_id:unpublish_course},function(data){
                              $("#publishedcourse").trigger("click");
                          });
                      });
                  });
              });
            });

            $("#personinfo").click(function(){
              $.get("/find_person_info_json", function(data, status){
                  $(".mynav").removeClass("active");
                  var personinfo = eval(data);
                  var personinfoDiv = '<div class="alert alert-info" role="alert">id: ' + personinfo[0] +  "</div>";
                  personinfoDiv += '<div class="alert alert-info" role="alert">name: ' + personinfo[1] +  "</div>";
                  personinfoDiv += '<div class="alert alert-info" role="alert">gender: ' + personinfo[2] +  "</div>";
                  personinfoDiv += '<div class="alert alert-info" role="alert">location: ' + personinfo[3] +  "</div>";
                  $("#mycontent").html(personinfoDiv);
                  $("#personinfo").addClass("active");
                  $("#choosedstudent").html("");
              });
            });
            $("#personinfo").trigger("click");

            $("#publishcourse").click(function(){
                  $(".mynav").removeClass("active");
                  var publishTable = '<div class="col-md-offset-4 col-md-4 column">';
                  publishTable += '<div class="col-md-8"> 课程ID<span class="label label-danger">5个字符</span> <input type="text" class="form-control" id="inputId" name="id"> </div> ';
                  publishTable += '<div class="col-md-8"> 课程名字 <input type="text" class="form-control" id="inputName" name="name"> </div> ';
                  publishTable += '<div class="col-md-8"> 上课时间 <input type="text" class="form-control" id="inputTime" name="time"> </div> ';
                  publishTable += '<div class="col-md-8"> 上课地点 <input type="text" class="form-control" id="inputAddr" name="address"> </div> ';
                  publishTable += '<div class="col-md-offset-2 col-md-10"> <button class="btn btn-primary" id="btn_to_publish_course" ">发布课程</button> </div> </div>';
                  publishTable += '</div>';
                  $("#mycontent").html(publishTable);
                  $("#publishcourse").addClass("active");
                  $("#choosedstudent").html("");

                  $("#btn_to_publish_course").click(function(){
                        if($("input")[0].value.length != 5){
                            $("#dialog_info").find("p").text("请按要求填写完整！");
                            $("#dialog_info").modal("show");
                            return false;
                        }
                        for(var i = 1; i < $("input").length; i++) {
                            if ($("input")[i].value == "") {
                                $("#dialog_info").find("p").text("请按要求填写完整！");
                                $("#dialog_info").modal("show");
                                return false;
                            }
                        }
                        $("#dialog_do_or_not").modal("show");
                        $("#btn_allow_to_do").unbind("click").click(function(){
                            var course_id = $("#inputId").val();
                            var course_name = $("#inputName").val();
                            var course_time = $("#inputTime").val();
                            var course_addr = $("#inputAddr").val();
                            var data = {'id':course_id, 'name':course_name, 'time':course_time, 'address':course_addr};
                            data = JSON.stringify(data);
                            $.post('/publish_new_course',{data:data},function(data){
                                if(data == 'duplicate'){
                                     $("#dialog_info").find("p").text("发布不成功，此课程ID重复！");
                                     $("#dialog_info").modal("show");
                                }
                                else{
                                    $("#publishedcourse").trigger("click");
                                }
                            });
                        });
                  });
            });

            function show_student(){
              $("tr").click(function(){
                  var course_id = $(this).find("input").val();
                  $.post('/show_my_student', {course_id:course_id}, function(data){
                      var student = eval(data);
                      var studentTable = '<table class="table table-striped">';
                      studentTable += '<input id="my_course_id" type="hidden" value="' + course_id + '">';
                      studentTable += '<caption>' + '<center>' + '<h3>' + course_id + '课程选课名单' + '</h3>' + '<center>' + '</caption>';
                      studentTable += '<thead><tr><th>学生ID</th><th>姓名</th><th>性别</th><th>籍贯</th><th>所得分数</th></tr></thead><tbody>';
                      for(var i = 0; i < student.length; i++){
                          var j;
                          studentTable += '<tr>';
                          studentTable += '<td>' + '<input type="hidden" name="student_id" value="' + student[i][0] + '">' + student[i][0] + '</td>';
                          for(j = 1; j < student[i].length - 1; j++){
                              studentTable += '<td>' + student[i][j] + '</td>';
                          }
                          studentTable += '<td class="col-md-2">' + '<input class="form-control col-md-4" name="student_score" type="text" value="' + student[i][j] + '">' +'</td>';
                          studentTable += '</tr>';
                      }
                      studentTable += '</tbody>';
                      studentTable += '</table>';
                      studentTable += '<div class="col-md-offset-11"> <button id="btn_submit_score" class="btn btn-primary">保存修改</button> </div>';
                      $("#choosedstudent").html(studentTable);

                      $("#btn_submit_score").click(function(){
                          $("#dialog_do_or_not").modal("show");
                          $("#btn_allow_to_do").unbind("click").click(function(){
                              var student_id = [];
                              var student_score = [];
                              for(var i = 0; i < $("[name=student_id]").length; i++){
                                  student_id.push($("[name=student_id]")[i].value);
                                  if($("[name=student_score]")[i].value == 'null' || $("[name=student_score]")[i].value >=0 && $("[name=student_score]")[i].value <= 100){
                                      student_score.push($("[name=student_score]")[i].value);
                                  }
                                  else{
                                      $("#dialog_do_or_not").modal("hide");
                                      $("#dialog_info").find("p").text("请确认数据的合法性！（0-100）");
                                      $("#dialog_info").modal("show");
                                      return false;
                                  }
                              }
                              student_id = JSON.stringify(student_id);
                              student_score = JSON.stringify(student_score);
                              course_id = JSON.stringify($("#my_course_id").val());
                              $.post('/input_score',{id: student_id, score:student_score, cou_id: course_id},function(data){
                                  if(data == 'success'){
                                      $("#dialog_do_or_not").modal("hide");
                                      $("#dialog_info").find("p").text("提交分数成功！");
                                      $("#dialog_info").modal("show");
                                  }
                              });
                          });
                      });
                  });
              });
              $("tr:eq(1)").trigger("click");
            }
});
