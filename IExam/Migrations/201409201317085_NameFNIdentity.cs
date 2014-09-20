namespace IExam.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NameFNIdentity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "FirstName", c => c.String(maxLength: 20));
            AddColumn("dbo.AspNetUsers", "LastName", c => c.String(maxLength: 20));
            AddColumn("dbo.AspNetUsers", "FN", c => c.String(maxLength: 10));
            AddColumn("dbo.AspNetUsers", "IdentityNumber", c => c.String(maxLength: 20));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "IdentityNumber");
            DropColumn("dbo.AspNetUsers", "FN");
            DropColumn("dbo.AspNetUsers", "LastName");
            DropColumn("dbo.AspNetUsers", "FirstName");
        }
    }
}
