using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace COMMON_PROJECT_STRUCTURE_API.services
{
    public class skillup_LearningPlan
    {
        dbServices ds = new dbServices();

          public async Task<responseData> InsertLearningPlan(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                // Validate input parameters
                if (!req.addInfo.ContainsKey("skillup_id") ||
                    !req.addInfo.ContainsKey("course_id") ||
                    !req.addInfo.ContainsKey("start_date") ||
                    !req.addInfo.ContainsKey("end_date") ||
                    !req.addInfo.ContainsKey("status"))
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Required parameters are missing";
                    return resData;
                }

                MySqlParameter[] insertParams = new MySqlParameter[]
                {
                    new MySqlParameter("@skillup_id", req.addInfo["skillup_id"].ToString()),
                    new MySqlParameter("@course_id", req.addInfo["course_id"].ToString()),
                    new MySqlParameter("@start_date", req.addInfo["start_date"].ToString()),
                    new MySqlParameter("@end_date", req.addInfo["end_date"].ToString()),
                    new MySqlParameter("@status", req.addInfo["status"].ToString())
                };

                // SQL query to insert learning plan
                string insertQuery = @"INSERT INTO Skillup_LearningPlan (skillup_id, course_id, start_date, end_date, status)
                    VALUES (@skillup_id, @course_id, @start_date, @end_date, @status);
                ";

                // Execute the SQL query
                var insertResult = ds.executeSQL(insertQuery, insertParams);

                // Check if insert was successful
                if (insertResult == null || insertResult[0].Count == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Failed to insert learning plan";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Learning plan inserted successfully";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }
         public async Task<responseData> ReadLearningPlan(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                // Validate input parameters
                if (!req.addInfo.ContainsKey("skillup_id") || !req.addInfo.ContainsKey("course_id"))
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Required parameters are missing";
                    return resData;
                }

                MySqlParameter[] Params = new MySqlParameter[]
                {
                    new MySqlParameter("@skillup_id", req.addInfo["skillup_id"].ToString()),
                    new MySqlParameter("@course_id", req.addInfo["course_id"].ToString())
                };

                var selectQuery = @"
                    SELECT * 
                    FROM Skillup_LearningPlan 
                    WHERE skillup_id = @skillup_id AND course_id = @course_id";

                var selectResult = ds.executeSQL(selectQuery, Params);

                if (selectResult[0].Count == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "No learning plan found";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Learning plan retrieved successfully";
                    resData.rData["learningPlans"] = selectResult;
                }
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