using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace IExam.Models
{
    public class IExamDBContext : DbContext
    {
        public IExamDBContext()
            : base("IExamProjectDataBase")
        {
        }
        public DbSet<Test> Tests { set; get; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<UsersTestAnswers> UsersTestAnswers { set; get; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Video> Videos { get; set; }

        private string _shemaName = string.Empty;

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer(new CreateDatabaseIfNotExists<ApplicationDbContext>());

            modelBuilder.Entity<Test>().ToTable("Tests", _shemaName);

            base.OnModelCreating(modelBuilder);
        }
    }

    public class Test
    {
        [Required]
        public int TestID { set; get; }

        [Required]
        public string TestName { get; set; }

        [Required]
        public string ApplicationUserID { set; get; }

        public ICollection<Question> Questions { get; set; }
        public ICollection<UsersTestAnswers> UsersTestAnswers { get; set; }
    }

    public class Question
    {
        [Required]
        public int QuestionID { set; get; }

        [Required]
        public int TestID { set; get; }

        [Required]
        public string QuestionDescription { get; set; }

        [Required]
        public string FirstAnswer { get; set; }

        [Required]
        public string SecondAnswer { get; set; }

        [Required]
        public string ThirdAnswer { get; set; }

        [Required]
        public string FourthAnswer { get; set; }

        [Required, MaxLength(1)]
        public string Answer { set; get; }
    }

    public class UsersTestAnswers
    {
        [Key]
        public int UsersAnswersID { set; get; }

        [Required]
        public int TestID { set; get; }

        [Required]
        public string ApplicationUserID { set; get; }

        [Required]
        public int TestQuestionNumber { set; get; }

        [Required]
        public int TestRightQuestionsNumber { set; get; }
    }

    public class Comment
    {
        [Key]
        public int CommentID { get; set; }

        [Required]
        public int VideoID { set; get; }

        [Required]
        public string ApplicationUserID { set; get; }

        [Required]
        public string message { get; set; }

        [Required]
        public string link { get; set; }

        [Required]
        public string user { get; set; }
    }

    public class Video
    {
        [Key]
        public int VideoID { get; set; }

        [Required]
        public string name { get; set; }

        [Required]
        public string link { get; set; }

        [Required]
        public string ApplicationUserID { set; get; }

        public ICollection<Comment> Comments { set; get; }
    }
}