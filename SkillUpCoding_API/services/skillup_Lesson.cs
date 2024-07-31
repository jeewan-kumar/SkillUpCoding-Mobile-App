using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace COMMON_PROJECT_STRUCTURE_API.services
{
    public class skillup_Lesson
    {
        dbServices ds = new dbServices();
        public async Task<responseData> Lesson(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] insertParams = new MySqlParameter[]
              {
                        new MySqlParameter("@course_id", req.addInfo["course_id"].ToString()),
                        new MySqlParameter("@title", req.addInfo["title"].ToString()),
                        new MySqlParameter("@description", req.addInfo["description"].ToString()),
              };
                var sq = @"insert into pc_student.Skillup_Lesson(course_id,title,description) values(@course_id,@title,@description)";

                var insertResult = ds.executeSQL(sq, insertParams);
                if (insertResult[0].Count() == null)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Failed to add lesson";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Lesson added successfully";

                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return resData;
        }
        public async Task<responseData> ReadLesson(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] Params = new MySqlParameter[]
              {
                        new MySqlParameter("@id", req.addInfo["id"]),
                       
              };
                var selectQuery = @"SELECT * FROM pc_student.Skillup_Lesson where id=@id";

                var selectResult = ds.executeSQL(selectQuery, Params);
                if (selectResult[0].Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "No Lesson found";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Lesson retrieved Successfully";
                    resData.rData["lessons"] = selectResult;
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }

        public async Task<responseData> UpdateLesson(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] updateParams = new MySqlParameter[]
                {
                    new MySqlParameter("@id", req.addInfo["id"].ToString()),
                    new MySqlParameter("@course_id", req.addInfo["course_id"].ToString()),
                    new MySqlParameter("@title", req.addInfo["title"].ToString()),
                    new MySqlParameter("@description", req.addInfo["description"].ToString()),
                   
                };

                var updateQuery = @"UPDATE pc_student.Skillup_Lesson SET course_id = @course_id, title = @title, description = @description WHERE id = @id";

                var updateResult = ds.executeSQL(updateQuery, updateParams);
                if (updateResult[0].Count() == 0 && updateResult==null)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "UnSuccessful update lesson";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "lesson updated Successfully";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }

        public async Task<responseData> DeleteLesson(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                // Create MySQL parameters for the delete query
                MySqlParameter[] deleteParams = new MySqlParameter[]
                {
                new MySqlParameter("@id", req.addInfo["id"].ToString()),
                new MySqlParameter("@status",0)
                };

                // Define the delete query
                var query = @"DELETE FROM pc_student.Skillup_Lesson WHERE id = @id";
                //var query = @"UPDATE pc_student.Skillup_UserProfile SET status = @status WHERE id = @id";

                // Execute the delete query
                var deleteResult = ds.executeSQL(query, deleteParams);

                // Check the result of the delete operation
                if (deleteResult[0].Count() == 0 && deleteResult==null)
                {
                    resData.rData["rCode"] = 1; // Unsuccessful
                    resData.rData["rMessage"] = "Profile Unsuccessful delete";
                }
                else
                {
                    resData.rData["rCode"] = 0; // Successful
                    resData.rData["rMessage"] = "profile delete Successful";
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the operation
                resData.rData["rCode"] = 1; // Indicate an error
                resData.rData["rMessage"] = "Error: " + ex.Message;
            }

            // Return the response data
            return resData;
        }

        public async Task<responseData> GetLessonsForCourse(requestData req)
{
    responseData resData = new responseData();
    try
    {
        // Retrieve courseId from request parameters
       // int courseId = Convert.ToInt32(req.addInfo["course_id"]);

        // Construct query parameters
        MySqlParameter[] queryParams = new MySqlParameter[]
        {
            new MySqlParameter("@course_id", req.addInfo["course_id"].ToString())
        };

        // Define the SELECT query to retrieve lessons for a course
        string selectQuery = @"SELECT * FROM pc_student.Skillup_Lesson WHERE course_id = @course_id";

        // Execute the query
        var selectResult = ds.executeSQL(selectQuery, queryParams);

        // Check if any lessons were found
        if (selectResult[0].Count == 0)
        {
            resData.rData["rCode"] = 1; // Unsuccessful
            resData.rData["rMessage"] = "No lessons found for the course";
        }
        else
        {
            resData.rData["rCode"] = 0; // Successful
            resData.rData["rMessage"] = "Lessons retrieved successfully";
            resData.rData["lessons"] = selectResult[0]; // Assuming selectResult is a list of lessons
        }
    }
    catch (Exception ex)
    {
        resData.rData["rCode"] = 1; // Unsuccessful
        resData.rData["rMessage"] = "An error occurred: " + ex.Message;
    }

    // Return the response data
    return resData;
}

    public async Task<responseData> GetLessonById(requestData req)
{
    responseData resData = new responseData();
    try
    {
        // Construct query parameters from the request data
        MySqlParameter[] queryParams = new MySqlParameter[]
        {
            new MySqlParameter("@id", req.addInfo["id"].ToString())
        };

        // Define the SELECT query to retrieve lesson details by lessonId
        string selectQuery = @"SELECT * FROM pc_student.Skillup_Lesson WHERE id = @id";

        // Execute the query
        var selectResult = ds.executeSQL(selectQuery, queryParams);

        // Check if the lesson was found
        if (selectResult.Count == 0)
        {
            resData.rData["rCode"] = 1; // Unsuccessful
            resData.rData["rMessage"] = "Lesson not found";
        }
        else
        {
            resData.rData["rCode"] = 0; // Successful
            resData.rData["rMessage"] = "Lesson retrieved successfully";
            resData.rData["lesson"] = selectResult[0]; // Assuming selectResult[0] contains the lesson details
        }
    }
    catch (Exception ex)
    {
        resData.rData["rCode"] = 1; // Unsuccessful
        resData.rData["rMessage"] = "An error occurred: " + ex.Message;
    }

    // Return the response data
    return resData;
}



    }
}