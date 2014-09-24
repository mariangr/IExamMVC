using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace IExam.Models
{
    public class UsersTestAnswersDBContext : DbContext
    {
        public UsersTestAnswersDBContext()
            : base("DefaultConnection")
        { 
        
        }

        public DbSet<UsersTestAnswers> UsersTestAnswers { set; get; }
    }

    public class UsersTestAnswers
    {
        [Key]
        public int UsersAnswersID { set; get; }

        [Required]
        public int TestID { set; get; }

        [Required]
        public string UserID { set; get; }

        [Required]
        public int TestQuestionNumber { set; get; }

        [Required]
        public int TestRightQuestionsNumber { set; get; }
    }
}