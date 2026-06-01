import random
from django.core.management.base import BaseCommand
from jobs.models import Job  
from accounts.models import User

class Command(BaseCommand):
    help = "Seed jobs into database"

    def handle(self, *args, **kwargs):
        roles = [
            "Frontend Developer", "Backend Developer", "Full Stack Developer",
            "Python Developer", "Java Developer", "React Developer",
            "AI Engineer", "Data Analyst"
        ]

        companies = [
            "Amazon", "Google", "Microsoft", "Infosys", "TCS", "Wipro", "Accenture"
        ]

        locations = [
            "Bangalore", "Hyderabad", "Chennai", "Pune", "Delhi", "Mumbai"
        ]

        skills = [
            "React, JavaScript, CSS",
            "Python, Django, REST API",
            "Java, Spring Boot",
            "Node.js, Express, MongoDB",
            "AI, ML, Python",
            "SQL, Power BI, Excel"
        ]
        recruiter = User.objects.filter(user_type="recruiter").first()

        if not recruiter:
            self.stdout.write(self.style.ERROR("❌ No recruiter found. Create one first."))
            return
        
        for i in range(100):
            Job.objects.create(
                title=random.choice(roles),
                company_name=random.choice(companies),
                location=random.choice(locations),
                salary=f"{random.randint(5,10)} LPA - {random.randint(10,20)} LPA",
                job_type=(
                ('Full Time', 'Full Time'),
                ('Part Time', 'Part Time'),
                ('Internship', 'Internship'),
                ('Contract', 'Contract'),
                ),
                description="Work on scalable applications and collaborate with teams.",
                skills=random.choice(skills),
                recruiter=recruiter
            )

        self.stdout.write(self.style.SUCCESS("100 Jobs Added Successfully"))