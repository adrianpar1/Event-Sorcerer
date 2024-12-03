'use client'

import { useState } from 'react'
import { format, addHours } from 'date-fns'
import { CalendarDays, CheckSquare, Home, LogOut, Users, Plus, ArrowRight, Calendar as CalendarIcon, Search, Filter, MoreVertical, DollarSign, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Event {
  id: string
  title: string
  date: Date
  description: string
  budget: number
  expenses: number
  attendees: number
  tasks: number
  tasksCompleted: number
  itinerary: ItineraryItem[]
}

interface ItineraryItem {
  id: string
  time: Date
  description: string
}

interface Task {
  id: string
  eventId: string
  title: string
  completed: boolean
  date: Date
  assignedTo: string
}

export function EventSorcererComponent() {
  const [activeTab, setActiveTab] = useState('home')
  const [events, setEvents] = useState<Event[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [newEvent, setNewEvent] = useState<Partial<Event>>({})
  const [newTask, setNewTask] = useState<Partial<Task>>({})
  const [newItineraryItem, setNewItineraryItem] = useState<Partial<ItineraryItem>>({})
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isItineraryItemDialogOpen, setIsItineraryItemDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.budget) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: newEvent.date,
        description: newEvent.description || '',
        budget: newEvent.budget,
        expenses: 0,
        attendees: 0,
        tasks: 0,
        tasksCompleted: 0,
        itinerary: [],
      }
      setEvents([...events, event])
      setNewEvent({})
      setIsEventDialogOpen(false)
    }
  }

  const handleCreateTask = () => {
    if (newTask.title && newTask.eventId && newTask.date) {
      const task: Task = {
        id: Date.now().toString(),
        eventId: newTask.eventId,
        title: newTask.title,
        completed: false,
        date: newTask.date,
        assignedTo: newTask.assignedTo || '',
      }
      setTasks([...tasks, task])
      const updatedEvents = events.map(event => 
        event.id === task.eventId ? { ...event, tasks: event.tasks + 1 } : event
      )
      setEvents(updatedEvents)
      setNewTask({})
      setIsTaskDialogOpen(false)
    }
  }

  const handleCreateItineraryItem = () => {
    if (newItineraryItem.time && newItineraryItem.description && selectedEvent) {
      const item: ItineraryItem = {
        id: Date.now().toString(),
        time: newItineraryItem.time,
        description: newItineraryItem.description,
      }
      const updatedEvent = {
        ...selectedEvent,
        itinerary: [...selectedEvent.itinerary, item].sort((a, b) => a.time.getTime() - b.time.getTime()),
      }
      setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event))
      setSelectedEvent(updatedEvent)
      setNewItineraryItem({})
      setIsItineraryItemDialogOpen(false)
    }
  }

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks)
    const updatedEvents = events.map(event => {
      const eventTasks = updatedTasks.filter(task => task.eventId === event.id)
      const completedTasks = eventTasks.filter(task => task.completed).length
      return { ...event, tasksCompleted: completedTasks }
    })
    setEvents(updatedEvents)
  }

  const addExpense = (eventId: string, amount: number) => {
    setEvents(events.map(event =>
      event.id === eventId ? { ...event, expenses: event.expenses + amount } : event
    ))
  }

  const pastEvents = events.filter(event => event.date < new Date())
  const upcomingEvents = events.filter(event => event.date >= new Date())
  const remainingTasks = tasks.filter(task => !task.completed)

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHome()
      case 'events':
        return renderEvents()
      case 'tasks':
        return renderTasks()
      default:
        return renderHome()
    }
  }

  const renderHome = () => (
    <>
      <h2 className="text-3xl font-bold mb-6">Welcome back to Event Sorcerer!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastEvents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Remaining</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remainingTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Upcoming Events</h3>
          <Button onClick={() => setIsEventDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
        {upcomingEvents.length === 0 ? (
          <div className="bg-lavender-100 p-4 rounded-lg text-center">
            <p>No upcoming events scheduled. Click "Create Event" to add a new event.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{format(event.date, 'MMMM d, yyyy')}</p>
                  <p>{event.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p>Budget: ${event.budget}</p>
                      <p>Expenses: ${event.expenses}</p>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedEvent(event)}>
                      Manage Event <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-4">Recent Tasks</h3>
        {tasks.length === 0 ? (
          <div className="bg-lavender-100 p-4 rounded-lg text-center">
            <p>No tasks added. Create an event to start adding tasks.</p>
          </div>
        ) : (
          <Card>
            <CardContent className="divide-y">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center py-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="mr-2"
                  />
                  <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                  <span className="ml-auto text-sm text-muted-foreground">{format(task.date, 'MMM d')}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </section>
    </>
  )

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Events</h2>
        <Button onClick={() => setIsEventDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>
      <div className="flex space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input type="text" placeholder="Search events..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <Card key={event.id} className="bg-lavender-50">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <p className="text-sm text-gray-500">{format(event.date, 'MMMM d, yyyy')}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(event)}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{event.description}</p>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{event.attendees} attendees</span>
                </div>
                <div className="flex items-center">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  <span>{event.tasksCompleted}/{event.tasks} tasks</span>
                </div>
              </div>
              <Progress value={(event.tasksCompleted / event.tasks) * 100} className="h-2" />
              <div className="mt-4">
                <p className="text-sm font-medium">Budget: ${event.budget}</p>
                <p className="text-sm font-medium">Expenses: ${event.expenses}</p>
                <Progress value={(event.expenses / event.budget) * 100} className="h-2 mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Tasks</h2>
        <Button onClick={() => setIsTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>
      <div className="flex space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input type="text" placeholder="Search tasks..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center p-4 border-b last:border-b-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
                className="mr-4 h-5 w-5 rounded border-gray-300 text-lavender-600 focus:ring-lavender-500"
              />
              <div className="flex-grow">
                <p className={cn("font-medium", task.completed && "line-through text-gray-500")}>{task.title}</p>
                <p className="text-sm text-gray-500">{format(task.date, 'MMMM d, yyyy')}</p>
              </div>
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={`/placeholder-avatar.jpg`} alt={task.assignedTo} />
                  <AvatarFallback>{task.assignedTo.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-500">{task.assignedTo}</span>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="flex h-screen bg-white-0">
      <aside className="w-64 bg-primary-500 p-4">
        <h1 className="text-6xl font-heading mb-8">Event Sorcerer</h1>
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className="text-lg w-full justify-start"
            onClick={() => setActiveTab('home')}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button
            variant="ghost"
            className="text-lg w-full justify-start"
            onClick={() => setActiveTab('events')}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Events
          </Button>
          <Button
            variant="ghost"
            className="text-lg w-full justify-start"
            onClick={() => setActiveTab('tasks')}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            Tasks
          </Button>
        </nav>
        <div className="absolute bottom-4 left-4 space-y-2">
          <Button variant="ghost" className="text-lg w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button variant="ghost" className="text-lg w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>

      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-title" className="text-right">
                Title
              </Label>
              <Input
                id="event-title"
                value={newEvent.title || ''}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-date" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !newEvent.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEvent.date ? format(newEvent.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newEvent.date}
                    onSelect={(date) => setNewEvent({ ...newEvent, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-budget" className="text-right">
                Budget
              </Label>
              <Input
                id="event-budget"
                type="number"
                value={newEvent.budget || ''}
                onChange={(e) => setNewEvent({ ...newEvent, budget: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="event-description"
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateEvent}>Create Event</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-title" className="text-right">
                Title
              </Label>
              <Input
                id="task-title"
                value={newTask.title || ''}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-event" className="text-right">
                Event
              </Label>
              <select
                id="task-event"
                value={newTask.eventId || ''}
                onChange={(e) => setNewTask({ ...newTask, eventId: e.target.value })}
                className="col-span-3"
              >
                <option value="">Select an event</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-date" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !newTask.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTask.date ? format(newTask.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTask.date}
                    onSelect={(date) => setNewTask({ ...newTask, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-assigned" className="text-right">
                Assigned To
              </Label>
              <Input
                id="task-assigned"
                value={newTask.assignedTo || ''}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateTask}>Create Task</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedEvent !== null} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="space-y-4">
                <p><strong>Date:</strong> {selectedEvent && format(selectedEvent.date, 'MMMM d, yyyy')}</p>
                <p><strong>Description:</strong> {selectedEvent?.description}</p>
                <p><strong>Attendees:</strong> {selectedEvent?.attendees}</p>
                <p><strong>Tasks:</strong> {selectedEvent?.tasksCompleted}/{selectedEvent?.tasks} completed</p>
                <Progress value={selectedEvent ? (selectedEvent.tasksCompleted / selectedEvent.tasks) * 100 : 0} className="h-2" />
              </div>
            </TabsContent>
            <TabsContent value="tasks">
              <div className="space-y-4">
                <Button onClick={() => setIsTaskDialogOpen(true)}>Add Task</Button>
                {tasks.filter(task => task.eventId === selectedEvent?.id).map(task => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="mr-2"
                      />
                      <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                    </div>
                    <span>{format(task.date, 'MMM d')}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="budget">
              <div className="space-y-4">
                <p><strong>Budget:</strong> ${selectedEvent?.budget}</p>
                <p><strong>Expenses:</strong> ${selectedEvent?.expenses}</p>
                <Progress value={selectedEvent ? (selectedEvent.expenses / selectedEvent.budget) * 100 : 0} className="h-2" />
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Expense amount"
                    className="w-32"
                    onChange={(e) => setNewExpense(parseFloat(e.target.value))}
                  />
                  <Button onClick={() => {
                    if (selectedEvent && newExpense) {
                      addExpense(selectedEvent.id, newExpense)
                      setNewExpense(0)
                    }
                  }}>
                    Add Expense
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="itinerary">
              <div className="space-y-4">
                <Button onClick={() => setIsItineraryItemDialogOpen(true)}>Add Itinerary Item</Button>
                {selectedEvent?.itinerary.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span>{format(item.time, 'h:mm a')}</span>
                    <span>{item.description}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={isItineraryItemDialogOpen} onOpenChange={setIsItineraryItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Itinerary Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itinerary-time" className="text-right">
                Time
              </Label>
              <Input
                id="itinerary-time"
                type="time"
                value={newItineraryItem.time ? format(newItineraryItem.time, 'HH:mm') : ''}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const time = addHours(new Date().setHours(0, 0, 0, 0), hours);
                  time.setMinutes(minutes);
                  setNewItineraryItem({ ...newItineraryItem, time });
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itinerary-description" className="text-right">
                Description
              </Label>
              <Input
                id="itinerary-description"
                value={newItineraryItem.description || ''}
                onChange={(e) => setNewItineraryItem({ ...newItineraryItem, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateItineraryItem}>Add Itinerary Item</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}