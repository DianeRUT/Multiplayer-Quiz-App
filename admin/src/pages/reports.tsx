import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, FileText, BarChart3 } from "lucide-react"

interface Report {
  id: number
  title: string
  description: string
  type: string
  status: string
  lastUpdated: string
  size: string
  icon: any
  color: string
}

const initialReports: Report[] = [
  {
    id: 1,
    title: "User Activity Report",
    description: "Comprehensive analysis of user engagement and activity patterns",
    type: "Analytics",
    status: "Generated",
    lastUpdated: "2024-01-19",
    size: "2.3 MB",
    icon: TrendingUp,
    color: "#10B981",
  },
  {
    id: 2,
    title: "Question Performance Report",
    description: "Detailed breakdown of question difficulty and success rates",
    type: "Performance",
    status: "Pending",
    lastUpdated: "2024-01-18",
    size: "1.8 MB",
    icon: TrendingDown,
    color: "#F59E0B",
  },
  {
    id: 3,
    title: "System Health Report",
    description: "Platform performance metrics and system diagnostics",
    type: "System",
    status: "Generated",
    lastUpdated: "2024-01-19",
    size: "0.9 MB",
    icon: CheckCircle,
    color: "#3B82F6",
  },
  {
    id: 4,
    title: "Error Log Report",
    description: "Compilation of system errors and user-reported issues",
    type: "Error",
    status: "Generated",
    lastUpdated: "2024-01-19",
    size: "1.2 MB",
    icon: AlertTriangle,
    color: "#EF4444",
  },
]

export function Reports() {
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [selectedType, setSelectedType] = useState("all")

  const filteredReports = reports.filter(report => 
    selectedType === "all" || report.type === selectedType
  )

  const handleGenerateReport = (type: string) => {
    const newReport: Report = {
      id: Date.now(),
      title: `${type} Report`,
      description: `Automatically generated ${type.toLowerCase()} report`,
      type: type,
      status: "Generated",
      lastUpdated: new Date().toISOString().split('T')[0],
      size: `${Math.floor(Math.random() * 3 + 0.5)}.${Math.floor(Math.random() * 9 + 1)} MB`,
      icon: type === "Analytics" ? TrendingUp : type === "Error" ? AlertTriangle : CheckCircle,
      color: type === "Analytics" ? "#10B981" : type === "Error" ? "#EF4444" : "#3B82F6",
    }
    setReports([...reports, newReport])
    alert(`${type} report generated! (This is a demo)`)
  }

  const handleDownloadReport = (id: number) => {
    const report = reports.find(r => r.id === id)
    alert(`Downloading ${report?.title}... (This is a demo)`)
  }

  const handleViewReport = (id: number) => {
    const report = reports.find(r => r.id === id)
    alert(`Viewing ${report?.title}... (This is a demo)`)
  }

  const handleDeleteReport = (id: number) => {
    if (confirm("Are you sure you want to delete this report?")) {
      setReports(reports.filter(report => report.id !== id))
      alert("Report deleted!")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Generate and manage platform reports</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Analytics">Analytics</SelectItem>
              <SelectItem value="Performance">Performance</SelectItem>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="Error">Error</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${report.color}15` }}
                      >
                        <report.icon className="h-6 w-6" style={{ color: report.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{report.type}</p>
                      </div>
                    </div>
                    <Badge
                      variant={report.status === "Generated" ? "default" : "secondary"}
                      className={
                        report.status === "Generated"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{report.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>Last updated: {report.lastUpdated}</span>
                    <span>Size: {report.size}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewReport(report.id)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredReports.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No reports found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => handleGenerateReport("Analytics")}
            >
              <TrendingUp className="h-6 w-6 mb-2" />
              Generate Analytics Report
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => handleGenerateReport("Error")}
            >
              <AlertTriangle className="h-6 w-6 mb-2" />
              Error Summary
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => handleGenerateReport("System")}
            >
              <CheckCircle className="h-6 w-6 mb-2" />
              System Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
