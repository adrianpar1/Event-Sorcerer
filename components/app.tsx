'use client'

import { CalendarDays, CheckSquare, ChevronDown, ChevronUp, Home, LogOut, Plus, Trash2, Users, X } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type Task = {
  id: string
  eventId: string
  date: Date
  description: string
  completed: boolean
}

type Event = {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  guests: number
  description: string
}

const isPastEvent = (date: Date) => {
  return date < new Date()
}

export function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Launch Party!',
      date: new Date(2024, 10, 26),
      startTime: '08:00',
      endTime: '11:00',
      guests: 5,
      description: "We're launching Event Sorcerer to the world! Let's hope the demo goes well.",
    },
    {
      id: '2',
      title: 'Team Meeting',
      date: new Date(2024, 11, 1),
      startTime: '10:00',
      endTime: '11:00',
      guests: 10,
      description: 'Monthly team sync to discuss project progress and upcoming milestones.',
    },
  ])
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', eventId: '1', date: new Date(2024, 10, 20), description: 'Buy supplies for "Launch Party"', completed: false },
    { id: '2', eventId: '1', date: new Date(2024, 10, 25), description: 'Prepare presentation slides', completed: false },
    { id: '3', eventId: '2', date: new Date(2024, 11, 30), description: 'Create meeting agenda', completed: false },
  ])
  const [showCompletedTasks, setShowCompletedTasks] = useState(true)

  const addTask = (eventId: string) => {
    const newTask: Task = {
      id: String(tasks.length + 1),
      eventId,
      date: new Date(),
      description: 'New task',
      completed: false,
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, ...updates } : task))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    setEvents(events.map(event => event.id === eventId ? { ...event, ...updates } : event))
  }

  const addEvent = () => {
    const newEvent: Event = {
      id: String(events.length + 1),
      title: 'New Event',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      guests: 0,
      description: 'New event description',
    }
    setEvents([...events, newEvent])
  }

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
    setTasks(tasks.filter(task => task.eventId !== eventId))
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-white">
        <Sidebar>
          <SidebarHeader>
            <h1 className="text-2xl font-serif p-4">Event Sorcerer</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  variant={activeView === 'dashboard' ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveView('dashboard')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  variant={activeView === 'events' ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveView('events')}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Events
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  variant={activeView === 'tasks' ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveView('tasks')}
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Tasks
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  variant={activeView === 'people' ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveView('people')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  People
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button variant="ghost" className="w-full justify-start text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 p-8 overflow-auto">
          <SidebarTrigger />
          {activeView === 'dashboard' && (
            <DashboardView
              events={events}
              tasks={tasks}
              updateEvent={updateEvent}
              updateTask={updateTask}
              deleteTask={deleteTask}
              deleteEvent={deleteEvent}
              addTask={addTask}
              addEvent={addEvent}
              showCompletedTasks={showCompletedTasks}
              setShowCompletedTasks={setShowCompletedTasks}
            />
          )}
          {activeView === 'events' && (
            <EventsView
              events={events}
              tasks={tasks}
              updateEvent={updateEvent}
              updateTask={updateTask}
              deleteTask={deleteTask}
              deleteEvent={deleteEvent}
              addTask={addTask}
              addEvent={addEvent}
              showCompletedTasks={showCompletedTasks}
              setShowCompletedTasks={setShowCompletedTasks}
            />
          )}
          {activeView === 'tasks' && (
            <TasksView
              events={events}
              tasks={tasks}
              updateTask={updateTask}
              deleteTask={deleteTask}
              addTask={addTask}
              showCompletedTasks={showCompletedTasks}
              setShowCompletedTasks={setShowCompletedTasks}
            />
          )}
        </div>
      </div>
    </SidebarProvider>
  )
}

function DashboardView({
  events,
  tasks,
  updateEvent,
  updateTask,
  deleteTask,
  deleteEvent,
  addTask,
  addEvent,
  showCompletedTasks,
  setShowCompletedTasks
}: {
  events: Event[]
  tasks: Task[]
  updateEvent: (eventId: string, updates: Partial<Event>) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  deleteEvent: (eventId: string) => void
  addTask: (eventId: string) => void
  addEvent: () => void
  showCompletedTasks: boolean
  setShowCompletedTasks: (show: boolean) => void
}) {
  const currentDate = new Date()
  const pastEvents = events.filter(event => event.date < currentDate)
  const upcomingEvents = events.filter(event => event.date >= currentDate)

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif">Welcome back to Event Sorcerer!</h2>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal">Past Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastEvents.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal">Tasks Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Events Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-serif">Events</h3>
          <Button onClick={addEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.slice(0, 3).map(event => (
            <EventCard
              key={event.id}
              event={event}
              updateEvent={updateEvent}
              deleteEvent={deleteEvent}
            />
          ))}
        </div>
        <Button variant="link" className="mt-4" onClick={() => {}}>
          All events →
        </Button>
      </div>

      {/* Tasks Section */}
      <div className="bg-[#E6E6FA] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-serif">Tasks</h3>
          <Button
            variant="outline"
            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
          >
            {showCompletedTasks ? 'Hide' : 'Show'} Completed Tasks
          </Button>
        </div>
        <div className="space-y-4">
          {tasks
            .filter(task => showCompletedTasks || !task.completed)
            .map(task => (
              <TaskItem
                key={task.id}
                task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
        </div>
        <Button variant="link" className="mt-4" onClick={() => {}}>
          All tasks →
        </Button>
      </div>
    </div>
  )
}

function EventCard({ event, updateEvent, deleteEvent }: {
  event: Event
  updateEvent: (eventId: string, updates: Partial<Event>) => void
  deleteEvent: (eventId: string) => void
}) {
  return (
    <Card className={`${isPastEvent(event.date) ? 'bg-gray-100' : 'bg-[#E6E6FA]'}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Input
            className="font-bold mb-1 bg-transparent border-none p-0 text-lg"
            value={event.title}
            onChange={(e) => updateEvent(event.id, { title: e.target.value })}
          />
          <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarDays className="mr-2 h-4 w-4" />
                {format(event.date, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={event.date}
                onSelect={(date) => date && updateEvent(event.id, { date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex gap-2 mt-2">
            <Input
              type="time"
              className="bg-transparent border-none p-0"
              value={event.startTime}
              onChange={(e) => updateEvent(event.id, { startTime: e.target.value })}
            />
            <span>-</span>
            <Input
              type="time"
              className="bg-transparent border-none p-0"
              value={event.endTime}
              onChange={(e) => updateEvent(event.id, { endTime: e.target.value })}
            />
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Users className="h-4 w-4 mr-1" />
          <Input
            className="w-12 bg-transparent border-none p-0"
            type="number"
            value={event.guests}
            onChange={(e) => updateEvent(event.id, { guests: parseInt(e.target.value) })}
          /> guests
        </div>
        <Input
          className="text-sm text-gray-700 mb-4 bg-transparent border-none p-0"
          value={event.description}
          onChange={(e) => updateEvent(event.id, { description: e.target.value })}
        />
        <Button variant="secondary" size="sm">
          Open event →
        </Button>
      </CardContent>
    </Card>
  )
}

function TaskItem({ task, updateTask, deleteTask }: {
  task: Task
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
}) {
  return (
    <div className={`flex items-center gap-4 ${task.completed ? 'text-gray-400' : ''}`}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300"
        checked={task.completed}
        onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
      />
      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarDays className="mr-2 h-4 w-4" />
              {format(task.date, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={task.date}
              onSelect={(date) => date && updateTask(task.id, { date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          className={`text-sm text-gray-600 bg-transparent border-none p-0 ${task.completed ? 'line-through' : ''}`}
          value={task.description}
          onChange={(e) => updateTask(task.id, { description: e.target.value })}
        />
      </div>
      <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

function EventsView({
  events,
  tasks,
  updateEvent,
  updateTask,
  deleteTask,
  deleteEvent,
  addTask,
  addEvent,
  showCompletedTasks,
  setShowCompletedTasks
}: {
  events: Event[]
  tasks: Task[]
  updateEvent: (eventId: string, updates: Partial<Event>) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  deleteEvent: (eventId: string) => void
  addTask: (eventId: string) => void
  addEvent: () => void
  showCompletedTasks: boolean
  setShowCompletedTasks: (show: boolean) => void
}) {
  const currentDate = new Date()
  const pastEvents = events.filter(event => event.date < currentDate)
  const upcomingEvents = events.filter(event => event.date >= currentDate)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Events</h2>
        <Button onClick={addEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-serif">Upcoming Events</h3>
        {upcomingEvents.map(event => (
          <EventListItem
            key={event.id}
            event={event}
            tasks={tasks.filter(t => t.eventId === event.id)}
            updateEvent={updateEvent}
            updateTask={updateTask}
            deleteTask={deleteTask}
            deleteEvent={deleteEvent}
            addTask={addTask}
            showCompletedTasks={showCompletedTasks}
            setShowCompletedTasks={setShowCompletedTasks}
          />
        ))}
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-serif">Past Events</h3>
        {pastEvents.map(event => (
          <EventListItem
            key={event.id}
            event={event}
            tasks={tasks.filter(t => t.eventId === event.id)}
            updateEvent={updateEvent}
            updateTask={updateTask}
            deleteTask={deleteTask}
            deleteEvent={deleteEvent}
            addTask={addTask}
            showCompletedTasks={showCompletedTasks}
            setShowCompletedTasks={setShowCompletedTasks}
          />
        ))}
      </div>
    </div>
  )
}

function EventListItem({
  event,
  tasks,
  updateEvent,
  updateTask,
  deleteTask,
  deleteEvent,
  addTask,
  showCompletedTasks,
  setShowCompletedTasks,
}: {
  event: Event
  tasks: Task[]
  updateEvent: (eventId: string, updates: Partial<Event>) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  deleteEvent: (eventId: string) => void
  addTask: (eventId: string) => void
  showCompletedTasks: boolean
  setShowCompletedTasks: (show: boolean) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`bg-[#E6E6FA] rounded-lg p-6 ${isPastEvent(event.date) ? 'opacity-70' : ''}`}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <Input
              className="font-bold mb-1 bg-transparent border-none p-0 text-lg"
              value={event.title}
              onChange={(e) => updateEvent(event.id, { title: e.target.value })}
            />
            <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {format(event.date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={event.date}
                  onSelect={(date) => date && updateEvent(event.id, { date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="flex gap-2 mt-2">
              <Input
                type="time"
                className="bg-transparent border-none p-0"
                value={event.startTime}
                onChange={(e) => updateEvent(event.id, { startTime: e.target.value })}
              />
              <span>-</span>
              <Input
                type="time"
                className="bg-transparent border-none p-0"
                value={event.endTime}
                onChange={(e) => updateEvent(event.id, { endTime: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Users className="h-4 w-4 mr-1" />
            <Input
              className="w-12 bg-transparent border-none p-0"
              type="number"
              value={event.guests}
              onChange={(e) => updateEvent(event.id, { guests: parseInt(e.target.value) })}
            /> guests
          </div>
        </div>
        <div className="flex-1">
          <Input
            className="text-sm text-gray-700 mb-4 bg-transparent border-none p-0"
            value={event.description}
            onChange={(e) => updateEvent(event.id, { description: e.target.value })}
          />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Tasks</h4>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            {isExpanded && (
              <>
                {tasks
                  .filter(task => showCompletedTasks || !task.completed)
                  .map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      updateTask={updateTask}
                      deleteTask={deleteTask}
                    />
                  ))}
                <Button variant="outline" size="sm" onClick={() => addTask(event.id)}>
                  Add Task
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TasksView({
  events,
  tasks,
  updateTask,
  deleteTask,
  addTask,
  showCompletedTasks,
  setShowCompletedTasks
}: {
  events: Event[]
  tasks: Task[]
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  addTask: (eventId: string) => void
  showCompletedTasks: boolean
  setShowCompletedTasks: (show: boolean) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Tasks</h2>
        <Button
          variant="outline"
          onClick={() => setShowCompletedTasks(!showCompletedTasks)}
        >
          {showCompletedTasks ? 'Hide' : 'Show'} Completed Tasks
        </Button>
      </div>
      {events.map(event => (
        <div key={event.id} className="bg-[#E6E6FA] rounded-lg p-6">
          <h3 className="text-xl font-serif mb-4">{event.title}</h3>
          <div className="space-y-4">
            {tasks
              .filter(t => t.eventId === event.id)
              .filter(task => showCompletedTasks || !task.completed)
              .map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              ))}
            <Button variant="outline" size="sm" onClick={() => addTask(event.id)}>
              Add Task
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}