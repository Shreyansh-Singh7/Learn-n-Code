Class
Employee
{
    int
id;
string
name;
string
department;
bool: working

public:
saveEmployeeTODatabase()
printEmployeeDetailReportXML()
printEmployeeDetailReportCSV()
terminateEmployee()
bool
isWorking()
};
// the above code does not follow SRP as the class employee has multiple roles and responsibilities
// if the format for reporting changes to any other form then the whole class needs to be changed