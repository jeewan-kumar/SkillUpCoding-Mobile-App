using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace COMMON_PROJECT_STRUCTURE_API.services
{
    public class skillup_Course
    {
        dbServices ds = new dbServices();
        public async Task<responseData> Course(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                byte[] imageData = null;

                if (req.addInfo.ContainsKey("course_Image"))
                {
                    var filePath = req.addInfo["course_Image"].ToString();
                    imageData = File.ReadAllBytes(filePath);
                }
                MySqlParameter[] insertParams = new MySqlParameter[]
              {
                        new MySqlParameter("@title", req.addInfo["title"].ToString()),
                        new MySqlParameter("@description", req.addInfo["description"].ToString()),
                        new MySqlParameter("@details", req.addInfo["details"].ToString()),
                        new MySqlParameter("@popularity", req.addInfo["popularity"].ToString())  ,
                        new MySqlParameter("@enrolled", req.addInfo["enrolled"].ToString()),
                        new MySqlParameter("@course_Image", MySqlDbType.Blob) { Value = imageData },
              };
                var sq = @"insert into pc_student.Skillup_Course(title,description,details,popularity,enrolled,course_Image) values(@title,@description,@details,@popularity,@enrolled,@course_Image)";

                var insertResult = ds.executeSQL(sq, insertParams);
                if (insertResult[0].Count() == null)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Failed to create course";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Course created successfully";

                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }

        public async Task<responseData> getCourse(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] Params = new MySqlParameter[]
                {
                    new MySqlParameter("@id", req.addInfo["id"])
                };
                var selectQuery = @"SELECT * FROM pc_student.Skillup_Course WHERE id = @id";

                var selectResult = ds.executeSQL(selectQuery, Params);

                if (selectResult == null || selectResult.Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Course Not found";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Course retrieved Successfully";
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

        public async Task<responseData> UpdateCourse(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                byte[] imageData = null;

                // Check if the request contains a new image file to update
                if (req.addInfo.ContainsKey("course_Image"))
                {
                    var filePath = req.addInfo["course_Image"].ToString();
                    imageData = File.ReadAllBytes(filePath);
                }

                // Parameters for SQL query
                MySqlParameter[] updateParams = null;

                // Check if image data is available to update
                if (imageData != null)
                {
                    updateParams = new MySqlParameter[]
                    {
                new MySqlParameter("@id", req.addInfo["id"].ToString()),
                new MySqlParameter("@title", req.addInfo["title"].ToString()),
                new MySqlParameter("@description", req.addInfo["description"].ToString()),
                new MySqlParameter("@details", req.addInfo["details"].ToString()),
                new MySqlParameter("@popularity", req.addInfo["popularity"].ToString()),
                new MySqlParameter("@enrolled", req.addInfo["enrolled"].ToString()),
                new MySqlParameter("@course_Image", MySqlDbType.Blob) { Value = imageData }
                    };
                }


                // SQL query to update course including image, conditionally
                var updateQuery = @"
            UPDATE pc_student.Skillup_Course 
            SET title = @title, 
                description = @description, 
                details = @details, 
                popularity = @popularity, 
                enrolled = @enrolled " + (imageData != null ? ", course_Image = @course_Image " : "") +
                    "WHERE id = @id";

                // Execute SQL update query
                var updateResult = ds.executeSQL(updateQuery, updateParams);

                // Check if update was successful
                if (updateResult == null || updateResult.Count() == 0 || updateResult[0].Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Unsuccessful update Course";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Course updated Successfully";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }


        public async Task<responseData> DeleteCourse(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] deleteParams = new MySqlParameter[]
                {
                    new MySqlParameter("@id", req.addInfo["id"].ToString())
                };

                var query = @"DELETE FROM pc_student.Skillup_Course WHERE id = @id";

                var deleteResult = ds.executeSQL(query, deleteParams);

                if (deleteResult == null || deleteResult.Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Course Unsuccessful delete";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Course delete Successful";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "Error: " + ex.Message;
            }
            return resData;
        }

        public async Task<responseData> GetAllCourses(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                var selectQuery = @"SELECT * FROM pc_student.Skillup_Course";
                var selectResult = ds.executeSQL(selectQuery, new MySqlParameter[0]);

                if (selectResult == null || selectResult.Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "No courses found";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Courses retrieved successfully";
                    resData.rData["courses"] = selectResult;
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "Error: " + ex.Message;
            }
            return resData;
        }
        public async Task<responseData> GetPopularCourses(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                var selectQuery = @"SELECT * FROM pc_student.Skillup_Course WHERE popularity > 0 ORDER BY popularity DESC LIMIT 10";
                var selectResult = ds.executeSQL(selectQuery, new MySqlParameter[0]);

                if (selectResult == null || selectResult.Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "No popular courses found";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Top popular courses retrieved successfully";
                    resData.rData["courses"] = selectResult;
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "Error: " + ex.Message;
            }
            return resData;
        }
        public async Task<responseData> GetUserEnrolledCourses(requestData req)
        {
            responseData resData = new responseData();
            try
            {

                if (!req.addInfo.ContainsKey("skillup_id"))
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Skillup ID is required";
                    return resData;
                }

                var selectQuery = @"
                    SELECT c.*
                    FROM pc_student.Skillup_Course c
                    JOIN pc_student.Skillup_Enrollment e ON c.id = e.course_id
                    WHERE e.skillup_id = @skillup_id;
                ";

                MySqlParameter[] getParams = new MySqlParameter[]
                {
                    new MySqlParameter("@skillup_id", req.addInfo["skillup_id"])
                };

                var selectResult = ds.executeSQL(selectQuery, getParams);

                if (selectResult[0].Count() == 0)
                {
                    resData.rData["rCode"] = 1; // Unsuccessful
                    resData.rData["rMessage"] = "No enrolled courses found";
                }
                else
                {
                    resData.rData["rCode"] = 0; // Successful
                    resData.rData["rMessage"] = "Enrolled courses retrieved successfully";
                    resData.rData["courses"] = selectResult;
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1; // Indicate an error
                resData.rData["rMessage"] = "Error: " + ex.Message;
            }

            return resData;
        }
        public async Task<responseData> AlreadyEnrollCourse(requestData req)
        {
            responseData resData = new responseData();
            try
            {

                if (!req.addInfo.ContainsKey("skillup_id") || !req.addInfo.ContainsKey("course_id"))
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Skillup ID and Course ID are required";
                    return resData;
                }

                var skillupId = req.addInfo["skillup_id"];
                var courseId = req.addInfo["course_id"];

                var checkQuery = $"SELECT * FROM pc_student.Skillup_Enrollment WHERE skillup_id = @skillup_id AND course_id = @course_id;";

                // Define parameters
                MySqlParameter[] checkParams = new MySqlParameter[]
                {
                    new MySqlParameter("@skillup_id", skillupId),
                    new MySqlParameter("@course_id", courseId)
                };

                // Execute the check query
                var checkResult = ds.executeSQL(checkQuery, checkParams);

                // If the user is already enrolled, return a message indicating so
                if (checkResult[0].Count() > 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Already enrolled in this course";
                    return resData;
                }

                // Define the SQL query to insert enrollment record
                var insertQuery = @"
                    INSERT INTO pc_student.Skillup_Enrollment (skillup_id, course_id)
                    VALUES (@skillup_id, @course_id);
                ";

                // Define parameters
                MySqlParameter[] insertParams = new MySqlParameter[]
                {
                    new MySqlParameter("@skillup_id", skillupId),
                    new MySqlParameter("@course_id", courseId)
                };

                // Execute the query
                var insertResult = ds.executeSQL(insertQuery, insertParams);

                // Check the result and set response data accordingly
                if (insertResult == null || insertResult.Count == 0)
                {
                    resData.rData["rCode"] = 1; // Unsuccessful
                    resData.rData["rMessage"] = "Failed to enroll in course";
                }
                else
                {
                    resData.rData["rCode"] = 0; // Successful
                    resData.rData["rMessage"] = "Enrolled in course successfully";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1; // Indicate an error
                resData.rData["rMessage"] = "Error: " + ex.Message;
            }

            return resData;
        }

        public async Task<responseData> SearchCourses(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                // Check if the 'keyword' exists in the request
                if (!req.addInfo.ContainsKey("keyword") || string.IsNullOrWhiteSpace(req.addInfo["keyword"].ToString()))
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Keyword is required for course search";
                    return resData;
                }

                string keyword = req.addInfo["keyword"].ToString();

                // Define SQL query to search for courses based on title or description
                string searchQuery = @"
            SELECT * FROM pc_student.Skillup_Course
            WHERE title LIKE @keyword OR description LIKE @keyword";

                // Define MySQL parameter
                MySqlParameter[] searchParams = new MySqlParameter[]
                {
            new MySqlParameter("@keyword", $"%{keyword}%")
                };

                // Execute the SQL query
                var searchResult = ds.executeSQL(searchQuery, searchParams);

                if (searchResult == null || searchResult.Count == 0 || searchResult[0].Count == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "No courses found matching the search criteria";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Courses retrieved successfully";
                    resData.rData["courses"] = searchResult;
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }

            return resData;
        }


        public async Task<responseData> UpdateCourseImage(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                byte[] imageData = null;

                // Check if the request contains a new image file to update
                if (req.addInfo.ContainsKey("course_Image"))
                {
                    var filePath = req.addInfo["course_Image"].ToString();
                    imageData = File.ReadAllBytes(filePath);
                }

                // Parameters for SQL query
                MySqlParameter[] updateParams = null;

                // Check if image data is available to update
                if (imageData != null)
                {
                    updateParams = new MySqlParameter[]
                    {
                new MySqlParameter("@id", req.addInfo["id"].ToString()),
                new MySqlParameter("@course_Image", MySqlDbType.Blob) { Value = imageData },

                    };
                }


                // SQL query to update record
                var updateQuery = @"UPDATE pc_student.Skillup_Course SET course_Image = @course_Image WHERE id = @id";

                // Execute SQL update query
                var updateResult = ds.executeSQL(updateQuery, updateParams);

                // Check if update was successful
                if (updateResult == null || updateResult.Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Unsuccessful update";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Updated Successfully";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }

        public async Task<responseData> DisplayEnrolledCourses(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                if (!req.addInfo.ContainsKey("skillup_id"))
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Skillup ID is required";
                    return resData;
                }

                var skillupId = req.addInfo["skillup_id"];

                var query = @"
            SELECT sc.id, sc.title, sc.description, sc.details, sc.popularity, sc.enrolled
            FROM pc_student.Skillup_Enrollment se
            JOIN pc_student.Skillup_Course sc ON se.course_id = sc.id
            WHERE se.skillup_id = @skillup_id;
        ";

                // Define parameters
                MySqlParameter[] parameters = new MySqlParameter[]
                {
            new MySqlParameter("@skillup_id", skillupId)
                };

                // Execute the query
                var result = ds.executeSQL(query, parameters);

                // Check the result and set response data accordingly
                if (result == null || result.Count == 0)
                {
                    resData.rData["rCode"] = 1; // No courses found
                    resData.rData["rMessage"] = "No courses found for the given Skillup ID";
                }
                else
                {
                    resData.rData["rCode"] = 0; // Successful
                    resData.rData["rMessage"] = "Enrolled courses retrieved successfully";
                    resData.rData["courses"] = result;
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1; // Indicate an error
                resData.rData["rMessage"] = "Error: " + ex.Message;
            }

            return resData;
        }
       public async Task<responseData> GetCourseDetailsWithLessons(requestData req)
{
    responseData resData = new responseData();
    try
    {
        if (!req.addInfo.ContainsKey("course_id"))
        {
            resData.rData["rCode"] = 1;
            resData.rData["rMessage"] = "Course ID is required";
            return resData;
        }

        // Ensure course_id is parsed correctly
        if (!int.TryParse(req.addInfo["course_id"].ToString(), out int courseId))
        {
            resData.rData["rCode"] = 1;
            resData.rData["rMessage"] = "Invalid course ID format";
            return resData;
        }

        // SQL query to fetch course details and associated lessons
        string query = @"
            SELECT l.id AS lesson_id,c.course_Image AS course_Image, c.title AS course_title, c.description AS course_description,
                   l.title AS lesson_title, l.description AS lesson_description
            FROM pc_student.Skillup_Course c
            LEFT JOIN pc_student.Skillup_Lesson l ON c.id = l.course_id
            WHERE c.id = @courseId;
        ";

        MySqlParameter[] parameters = new MySqlParameter[]
        {
            new MySqlParameter("@courseId", courseId)
        };

        var result = ds.executeSQL(query, parameters);

        if (result == null)
        {
            resData.rData["rCode"] = 1;
            resData.rData["rMessage"] = "Failed to fetch course details and lessons";
            return resData;
        }

        // Prepare response data
        resData.rData["rCode"] = 0;
        resData.rData["rMessage"] = "Course details and lessons retrieved successfully";
        resData.rData["course_details"] = result;

    }
    catch (Exception ex)
    {
        resData.rData["rCode"] = 1;
        resData.rData["rMessage"] = "An error occurred: " + ex.Message;
    }
    return resData;
}

        public async Task<responseData> GetVideosForLesson(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                if (!req.addInfo.ContainsKey("lesson_id"))
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Lesson ID is required";
                    return resData;
                }

                int lessonId = Convert.ToInt32(req.addInfo["lesson_id"]);

                // SQL query to fetch videos based on lesson ID
                string query = @"
            SELECT id AS video_id, title AS video_title, url AS video_url, duration AS video_duration
            FROM pc_student.Skillup_Video
            WHERE lesson_id = @lessonId;
        ";

                MySqlParameter[] parameters = new MySqlParameter[]
                {
            new MySqlParameter("@lessonId", lessonId)
                };

                var result = ds.executeSQL(query, parameters);

                if (result == null)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Failed to fetch videos for the lesson";
                    return resData;
                }

                // Prepare response data
                resData.rData["rCode"] = 0;
                resData.rData["rMessage"] = "Videos retrieved successfully";
                resData.rData["videos"] = result;

            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }




    }
}

