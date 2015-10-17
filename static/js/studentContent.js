$(document).ready(function(){
          $("#choosedcourse").click(function () {
              $.get("/choosedcourse_json", function(data, status){
                  var choosedcourse = eval(data);
                  $(".mynav").removeClass("active");
                  var courseTable = ' <table class="table table-bordered"><thead><tr><th>课程编号</th><th>名称</th><th>上课时间</th><th>上课地点</th><th>分数</th><th>退选</th></tr></thead><tbody>';
                  for(var i = 0; i < choosedcourse.length; i++){
                      courseTable += "<tr>";
                      var course_id = choosedcourse[i][0];
                      for(var j = 0; j < choosedcourse[i].length; j++){
                          courseTable += "<td>" + choosedcourse[i][j] + "</td>";
                      }
                      courseTable += "<td>" + '<input type="checkbox" value="' + course_id + '">' + "</td>";
                      courseTable += "</tr>";
                  }
                  courseTable += "</tbody></table>";
                  courseTable += '<div class="col-md-offset-11"> <button type="button" class="btn btn-primary" id="to_unchoose_course" ">提交</button> </div>';
                  $("#mycontent").html(courseTable);
                  $("#choosedcourse").addClass("active");
                  $("#to_unchoose_course").click(function(){
                      if($("input:checked").length == 0){
                          $('#dialog_not_check_course').modal('show');
                          return false;
                      }
                      $('#dialog_do_or_not').modal('show');
                      $("#btn_allow_to_do").unbind('click').click(function(){
                          var course_id_arr = [];
                          for(var i = 0; i < $("input:checked").length; i++){
                              course_id_arr.push($("input:checked")[i].value);
                          }
                          course_id_arr = JSON.stringify(course_id_arr);
                          $.post('/to_unchoose_course',{checkcourse_id:course_id_arr},function(data){
                              $("#choosedcourse").trigger("click");
                          });
                      });
                  });
              });
          });
          $("#personinfo").click(function(){
              $.get("/find_person_info_json", function(data, status){
                  $(".mynav").removeClass("active");
                  var personinfo = eval(data);
                  alert(personinfo);
                  var personinfoDiv = '<div class="alert alert-info" role="alert">id: ' + personinfo[0] +  "</div>";
                  personinfoDiv += '<div class="alert alert-info" role="alert">name: ' + personinfo[1] +  "</div>";
                  personinfoDiv += '<div class="alert alert-info" role="alert">gender: ' + personinfo[2] +  "</div>";
                  personinfoDiv += '<div class="alert alert-info" role="alert">location: ' + personinfo[3] +  "</div>";
                  $("#mycontent").html(personinfoDiv);
                  $("#personinfo").addClass("active");
              });
          });
          $("#personinfo").trigger("click");

          $("#un_choosedcourse").click(function(){
              $.get("/find_unchoosedcourse_json", function(data, status){
                  var unchoosedcourse = eval(data);
                  $(".mynav").removeClass("active");
                  var uncourseTable = ' <table class="table table-bordered"><thead><tr><th>课编号</th><th>名称</th><th>上课时间</th><th>上课地点</th><th>选课</th></tr></thead><tbody>';
                  for(var i = 0; i < unchoosedcourse.length; i++){
                      uncourseTable += "<tr>";
                      var course_id = unchoosedcourse[i][0];
                      for(var j = 0; j < unchoosedcourse[i].length; j++){
                          uncourseTable += "<td>" + unchoosedcourse[i][j] + "</td>";
                      }
                      uncourseTable += "<td>" + '<input type="checkbox" class="cou" name="checkcourse" value="' + course_id + '">' + "</td>";
                      uncourseTable += "</tr>";
                  }
                  uncourseTable += "</tbody></table>";
                  uncourseTable += '<div class="col-md-offset-11"> <button type="button" class="btn btn-primary" id="to_choose_course" ">提交</button> </div>';
                  $("#mycontent").html(uncourseTable);
                  $("#un_choosedcourse").addClass("active");

                  $("#to_choose_course").click(function(){
                      if($("input:checked").length == 0){
                          $('#dialog_not_check_course').modal('show');
                          return false;
                      }
                      $("#dialog_do_or_not").modal('show');
                      $("#btn_allow_to_do").unbind('click').click(function(){
                          var course_id_arr = [];
                          for(var i = 0; i < $("input:checked").length; i++){
                              course_id_arr.push($("input:checked")[i].value);
                          }
                          course_id_arr = JSON.stringify(course_id_arr);
                          $.post('/to_choose_course',{checkcourse_id:course_id_arr}, function(data){
                              $("#un_choosedcourse").trigger("click");
                          });
                      });
                  });
              });
          });
});


