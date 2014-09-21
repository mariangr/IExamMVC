using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.Entity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IExam.Models
{
    public class TestsDBContext : DbContext
    {
        public TestsDBContext()
            :base("DefaultConnection")
        {
        }
        public DbSet<Test> Tests { set; get; }
        public DbSet<Question> Questions { get; set; }
    }

    public class Test
    {
        [Required]
        public int TestID { set; get; }

        [Required]
        public string TestName { get; set; }

        public ICollection<Question> Questions { get; set; }
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
}