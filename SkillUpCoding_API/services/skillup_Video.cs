
using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace COMMON_PROJECT_STRUCTURE_API.services
{
    public class skillup_Video
    {
        dbServices ds = new dbServices();
        public async Task<responseData> Video(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] insertParams = new MySqlParameter[]
              {
                        new MySqlParameter("@lesson_id", req.addInfo["lesson_id"].ToString()),
                        new MySqlParameter("@title", req.addInfo["title"].ToString()),
                        new MySqlParameter("@url", req.addInfo["url"].ToString()),
                        new MySqlParameter("@duration", req.addInfo["duration"].ToString())  ,
              };
                var sq = @"insert into pc_student.Skillup_Video(lesson_id,title,url,duration) values(@lesson_id,@title,@url,@duration)";

                var insertResult = ds.executeSQL(sq, insertParams);

                if (insertResult[0].Count() == null)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "video insert UnSuccessful";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Video insert Successful";

                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return resData;
        }

        public async Task<responseData> ReadVideo(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] Params = new MySqlParameter[]
              {
                        new MySqlParameter("@id", req.addInfo["id"]),

              };
                var selectQuery = @"SELECT * FROM pc_student.Skillup_Video where id=@id";

                var selectResult = ds.executeSQL(selectQuery, Params);
                if (selectResult[0].Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "No Video found";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "video retrieved Successfully";
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

        public async Task<responseData> UpdateVideo(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] updateParams = new MySqlParameter[]
                {
                    new MySqlParameter("@id", req.addInfo["id"].ToString()),
                    new MySqlParameter("@lesson_id", req.addInfo["lesson_id"].ToString()),
                    new MySqlParameter("@title", req.addInfo["title"].ToString()),
                    new MySqlParameter("@url", req.addInfo["url"].ToString()),
                    new MySqlParameter("@duration", req.addInfo["duration"].ToString())  ,

                };

                var updateQuery = @"UPDATE pc_student.Skillup_Video SET lesson_id = @lesson_id, title = @title, url = @url, duration = @duration WHERE id = @id";

                var updateResult = ds.executeSQL(updateQuery, updateParams);
                if (updateResult[0].Count() == 0 && updateResult == null)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "UnSuccessful update video";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "video updated Successfully";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }

        public async Task<responseData> DeleteVideo(requestData req)
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
                var query = @"DELETE FROM pc_student.Skillup_Video WHERE id = @id";
                //var query = @"UPDATE pc_student.Skillup_UserProfile SET status = @status WHERE id = @id";

                // Execute the delete query
                var deleteResult = ds.executeSQL(query, deleteParams);

                // Check the result of the delete operation
                if (deleteResult[0].Count() == 0 && deleteResult == null)
                {
                    resData.rData["rCode"] = 1; // Unsuccessful
                    resData.rData["rMessage"] = "video Unsuccessful delete";
                }
                else
                {
                    resData.rData["rCode"] = 0; // Successful
                    resData.rData["rMessage"] = "video delete Successful";
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
        public async Task<responseData> VideoForLesson(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                // int lessonId = Convert.ToInt32(req.addInfo["lessonId"]);

                MySqlParameter[] queryParams = new MySqlParameter[]
                {
            new MySqlParameter("@lesson_id", req.addInfo["lesson_id"].ToString())
                };

                // Define the SELECT query to retrieve lessons for a course
                string selectQuery = @"SELECT sv.id,sc.title AS course_title, sc.course_Image, sv.title AS video_title, sv.url, sv.duration       
                FROM Skillup_Video sv
                JOIN Skillup_Lesson sl ON sv.lesson_id = sl.id
                JOIN Skillup_Course sc ON sl.course_id = sc.id WHERE lesson_id = @lesson_id";

                // Execute the query
                var selectResult = ds.executeSQL(selectQuery, queryParams);

                // Check if any lessons were found
                if (selectResult[0].Count == 0)
                {
                    resData.rData["rCode"] = 1; // Unsuccessful
                    resData.rData["rMessage"] = "No videos found for the lesson";
                }
                else
                {
                    resData.rData["rCode"] = 0; // Successful
                    resData.rData["rMessage"] = "Videos retrieved successfully";
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
    }
}