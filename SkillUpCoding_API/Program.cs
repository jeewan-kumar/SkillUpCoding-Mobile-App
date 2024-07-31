
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using COMMON_PROJECT_STRUCTURE_API.services;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using TravelMate_Api.services;

WebHost.CreateDefaultBuilder().
ConfigureServices(s =>
{
    IConfiguration appsettings = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
    s.AddSingleton<login>();
      s.AddSingleton<TravelMates_Users>();
    s.AddSingleton<skillup_UserSignUp>();
    s.AddSingleton<skillup_UserProfile>();
    s.AddSingleton<skillup_UserSignIn>();
    s.AddSingleton<skillup_Course>();
    s.AddSingleton<skillup_Lesson>();
    s.AddSingleton<skillup_Video>();
    s.AddSingleton<upload>();
    s.AddSingleton<contact>();
    s.AddSingleton<Skillup_Onboarding>();
    s.AddSingleton<skillup_LearningPlan>();

    s.AddAuthorization();
    s.AddControllers();
    s.AddCors();
    s.AddAuthentication("SourceJWT").AddScheme<SourceJwtAuthenticationSchemeOptions, SourceJwtAuthenticationHandler>("SourceJWT", options =>
        {
            options.SecretKey = appsettings["jwt_config:Key"].ToString();
            options.ValidIssuer = appsettings["jwt_config:Issuer"].ToString();
            options.ValidAudience = appsettings["jwt_config:Audience"].ToString();
            options.Subject = appsettings["jwt_config:Subject"].ToString();
        });
}).Configure(app =>
{
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseCors(options =>
            options.WithOrigins("https://localhost:5002", "http://localhost:5001")
            .AllowAnyHeader().AllowAnyMethod().AllowCredentials());
    app.UseRouting();
    app.UseStaticFiles();

    app.UseEndpoints(e =>
    {
        var login = e.ServiceProvider.GetRequiredService<login>();
        var TravelMates_Users = e.ServiceProvider.GetRequiredService<TravelMates_Users>();
        var skillup_UserSignUp = e.ServiceProvider.GetRequiredService<skillup_UserSignUp>();
        var skillup_UserProfile = e.ServiceProvider.GetRequiredService<skillup_UserProfile>();
        var skillup_UserSignIn = e.ServiceProvider.GetRequiredService<skillup_UserSignIn>();
        var skillup_Course = e.ServiceProvider.GetRequiredService<skillup_Course>();
        var skillup_Lesson = e.ServiceProvider.GetRequiredService<skillup_Lesson>();
        var skillup_Video = e.ServiceProvider.GetRequiredService<skillup_Video>();
        var Skillup_Onboarding = e.ServiceProvider.GetRequiredService<Skillup_Onboarding>();
        var upload = e.ServiceProvider.GetRequiredService<upload>();
        var contact = e.ServiceProvider.GetRequiredService<contact>();
        var skillup_LearningPlan = e.ServiceProvider.GetRequiredService<skillup_LearningPlan>();

        e.MapPost("login",
     [AllowAnonymous] async (HttpContext http) =>
     {
         var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
         requestData rData = JsonSerializer.Deserialize<requestData>(body);
         if (rData.eventID == "1001") // update
             await http.Response.WriteAsJsonAsync(await login.Login(rData));

     });

        e.MapPost("TravelMates_Users",
     [AllowAnonymous] async (HttpContext http) =>
     {
         var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
         requestData rData = JsonSerializer.Deserialize<requestData>(body);
         if (rData.eventID == "1001") // update
             await http.Response.WriteAsJsonAsync(await TravelMates_Users.TravelMates_UserSignUp(rData));

     });
        e.MapPost("skillup_LearningPlan",
   [AllowAnonymous] async (HttpContext http) =>
   {
       var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
       requestData rData = JsonSerializer.Deserialize<requestData>(body);
       if (rData.eventID == "1001") // InsertLearningPlan
           await http.Response.WriteAsJsonAsync(await skillup_LearningPlan.InsertLearningPlan(rData));
       if (rData.eventID == "1002") // ReadLearningPlan
           await http.Response.WriteAsJsonAsync(await skillup_LearningPlan.ReadLearningPlan(rData));

   });
        e.MapPost("skillup_UserSignUp",
[AllowAnonymous] async (HttpContext http) =>
{
    var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
    requestData rData = JsonSerializer.Deserialize<requestData>(body);
    if (rData.eventID == "1001") // UserSignUp
        await http.Response.WriteAsJsonAsync(await skillup_UserSignUp.UserSignUp(rData));
    if (rData.eventID == "1002") // ForgotPassword
        await http.Response.WriteAsJsonAsync(await skillup_UserSignUp.ForgotPassword(rData));
    if (rData.eventID == "1003") // ResetPassword
        await http.Response.WriteAsJsonAsync(await skillup_UserSignUp.ResetPassword(rData));
    if (rData.eventID == "1004") // VerifyOtp
        await http.Response.WriteAsJsonAsync(await skillup_UserSignUp.VerifyOtp(rData));
    if (rData.eventID == "1005") // VerifyOtp
        await http.Response.WriteAsJsonAsync(await skillup_UserSignUp.ReadUserSignUp(rData));
});


        e.MapPost("skillup_UserProfile",
         [AllowAnonymous] async (HttpContext http) =>
         {
             var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
             requestData rData = JsonSerializer.Deserialize<requestData>(body);
             if (rData.eventID == "1001") // Insert
                 await http.Response.WriteAsJsonAsync(await skillup_UserProfile.CreateProfile(rData));
             if (rData.eventID == "1002") // Read
                 await http.Response.WriteAsJsonAsync(await skillup_UserProfile.ReadProfile(rData));
             if (rData.eventID == "1003") // update
                 await http.Response.WriteAsJsonAsync(await skillup_UserProfile.UpdateProfile(rData));
             if (rData.eventID == "1004") // Delete
                 await http.Response.WriteAsJsonAsync(await skillup_UserProfile.DeleteProfile(rData));
             if (rData.eventID == "1005") // UpdateUserProfileImage
                 await http.Response.WriteAsJsonAsync(await skillup_UserProfile.UpdateUserProfileImage(rData));
             if (rData.eventID == "1006") // GetUserProfile
                 await http.Response.WriteAsJsonAsync(await skillup_UserProfile.GetUserProfile(rData));
             if (rData.eventID == "1007") // UpdateUserProfileImage
                 await http.Response.WriteAsJsonAsync(await skillup_UserProfile.UpdateUserProfile(rData));

         });

        e.MapPost("Skillup_Onboarding",
       [AllowAnonymous] async (HttpContext http) =>
       {
           var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
           requestData rData = JsonSerializer.Deserialize<requestData>(body);
           if (rData.eventID == "1001") // Insert
               await http.Response.WriteAsJsonAsync(await Skillup_Onboarding.InsertData(rData));
           if (rData.eventID == "1002") // Read
               await http.Response.WriteAsJsonAsync(await Skillup_Onboarding.ReadData(rData));
           if (rData.eventID == "1003") // update
               await http.Response.WriteAsJsonAsync(await Skillup_Onboarding.UpdateData(rData));
           if (rData.eventID == "1004") // Delete
               await http.Response.WriteAsJsonAsync(await Skillup_Onboarding.DeleteData(rData));

       });

        e.MapPost("skillup_UserSignIn",
         [AllowAnonymous] async (HttpContext http) =>
         {
             var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
             requestData rData = JsonSerializer.Deserialize<requestData>(body);
             if (rData.eventID == "1001") // UserSignIn
                 await http.Response.WriteAsJsonAsync(await skillup_UserSignIn.UserSignIn(rData));

             if (rData.eventID == "1002") // UserLogout
                 await http.Response.WriteAsJsonAsync(await skillup_UserSignIn.UserLogout(rData));

         });
        e.MapPost("skillup_Video",
         [AllowAnonymous] async (HttpContext http) =>
         {
             var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
             requestData rData = JsonSerializer.Deserialize<requestData>(body);
             if (rData.eventID == "1001") // update
                 await http.Response.WriteAsJsonAsync(await skillup_Video.Video(rData));
             if (rData.eventID == "1002") // Read
                 await http.Response.WriteAsJsonAsync(await skillup_Video.ReadVideo(rData));
             if (rData.eventID == "1003") // update
                 await http.Response.WriteAsJsonAsync(await skillup_Video.UpdateVideo(rData));
             if (rData.eventID == "1004") // Delete
                 await http.Response.WriteAsJsonAsync(await skillup_Video.DeleteVideo(rData));

             if (rData.eventID == "1005") // VideoForLesson
                 await http.Response.WriteAsJsonAsync(await skillup_Video.VideoForLesson(rData));

         });

        e.MapPost("skillup_Lesson",
         [AllowAnonymous] async (HttpContext http) =>
         {
             var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
             requestData rData = JsonSerializer.Deserialize<requestData>(body);
             if (rData.eventID == "1001") // update
                 await http.Response.WriteAsJsonAsync(await skillup_Lesson.Lesson(rData));
             if (rData.eventID == "1002") // Read
                 await http.Response.WriteAsJsonAsync(await skillup_Lesson.ReadLesson(rData));
             if (rData.eventID == "1003") // update
                 await http.Response.WriteAsJsonAsync(await skillup_Lesson.UpdateLesson(rData));
             if (rData.eventID == "1004") // Delete
                 await http.Response.WriteAsJsonAsync(await skillup_Lesson.DeleteLesson(rData));
             if (rData.eventID == "1005") // GetLessonsForCourse
                 await http.Response.WriteAsJsonAsync(await skillup_Lesson.GetLessonsForCourse(rData));
             if (rData.eventID == "1006") // GetLessonById
                 await http.Response.WriteAsJsonAsync(await skillup_Lesson.GetLessonById(rData));

         });

        e.MapPost("skillup_Course",
         [AllowAnonymous] async (HttpContext http) =>
         {
             var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
             requestData rData = JsonSerializer.Deserialize<requestData>(body);
             if (rData.eventID == "1001") // update
                 await http.Response.WriteAsJsonAsync(await skillup_Course.Course(rData));
             if (rData.eventID == "1002") // Read
                 await http.Response.WriteAsJsonAsync(await skillup_Course.getCourse(rData));
             if (rData.eventID == "1003") // update
                 await http.Response.WriteAsJsonAsync(await skillup_Course.UpdateCourse(rData));
             if (rData.eventID == "1004") // Delete
                 await http.Response.WriteAsJsonAsync(await skillup_Course.DeleteCourse(rData));
             if (rData.eventID == "1005") // GetAllCourses
                 await http.Response.WriteAsJsonAsync(await skillup_Course.GetAllCourses(rData));
             if (rData.eventID == "1006") // GetPopularCourses
                 await http.Response.WriteAsJsonAsync(await skillup_Course.GetPopularCourses(rData));
             if (rData.eventID == "1007") // GetUserEnrolledCourses
                 await http.Response.WriteAsJsonAsync(await skillup_Course.GetUserEnrolledCourses(rData));
             if (rData.eventID == "1008") // AlreadyEnrollCourse
                 await http.Response.WriteAsJsonAsync(await skillup_Course.AlreadyEnrollCourse(rData));
             if (rData.eventID == "1009") // SearchCourses
                 await http.Response.WriteAsJsonAsync(await skillup_Course.SearchCourses(rData));
             if (rData.eventID == "10010") // UpdateCourseImage
                 await http.Response.WriteAsJsonAsync(await skillup_Course.UpdateCourseImage(rData));
             if (rData.eventID == "10011") // DisplayEnrolledCourses
                 await http.Response.WriteAsJsonAsync(await skillup_Course.DisplayEnrolledCourses(rData));
             if (rData.eventID == "10012") // DisplayEnrolledCourses
                 await http.Response.WriteAsJsonAsync(await skillup_Course.GetCourseDetailsWithLessons(rData));
             if (rData.eventID == "10013") // DisplayEnrolledCourses
                 await http.Response.WriteAsJsonAsync(await skillup_Course.GetVideosForLesson(rData));


         });

        e.MapPost("upload",
  [AllowAnonymous] async (HttpContext http) =>
  {
      var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
      requestData rData = JsonSerializer.Deserialize<requestData>(body);
      if (rData.eventID == "1001") // update
          await http.Response.WriteAsJsonAsync(await upload.Upload(rData));

  });

        e.MapPost("contact",
   [AllowAnonymous] async (HttpContext http) =>
   {
       var body = await new StreamReader(http.Request.Body).ReadToEndAsync();
       requestData rData = JsonSerializer.Deserialize<requestData>(body);
       if (rData.eventID == "1005") // update
           await http.Response.WriteAsJsonAsync(await contact.Contact(rData));

   });

        IConfiguration appsettings = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        e.MapGet("/dbstring",
                  async c =>
                  {
                      dbServices dspoly = new dbServices();
                      await c.Response.WriteAsJsonAsync("{'mongoDatabase':" + appsettings["mongodb:connStr"] + "," + " " + "MYSQLDatabase" + " =>" + appsettings["db:connStrPrimary"]);
                  });

        e.MapGet("/bing",
          async c => await c.Response.WriteAsJsonAsync("{'Name':'Anish','Age':'26','Project':'COMMON_PROJECT_STRUCTURE_API'}"));
    });
}).Build().Run();
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
public record requestData
{
    [Required]
    public string eventID { get; set; }
    [Required]
    public IDictionary<string, object> addInfo { get; set; }
}

public record responseData
{
    public responseData()
    {
        eventID = "";
        rStatus = 0;
        rData = new Dictionary<string, object>();
    }
    [Required]
    public int rStatus { get; set; } = 0;
    public string eventID { get; set; }
    public IDictionary<string, object> addInfo { get; set; }
    public IDictionary<string, object> rData { get; set; }
}
