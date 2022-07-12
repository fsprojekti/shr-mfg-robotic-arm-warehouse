# Robot arm Warehouse

## Layout
Robot arm represents arbitrary package manipulation device that can be configured to simulate different types of manufacturing and supply chain facilities. One of them is a warehouse facility that stores packages. The layout of the warehouse is presented on the figure 

![image](https://i.ibb.co/bNHq9ST/Drawing1.png)
* **operational area**
Robot arm movement is limited by the operational area which is a rectangular shaped surface. 
* **dock**
Dock represents a position inside operational area that is reserved for placement of packages. There are five types of docks: receive dock, receive buffer dock, dispatch dock, dispatch buffer dock and storage dock
	* **receive dock**
This type of dock is reserved for transportation vehicles for unloading of their cargo (packages) 
	* **receive buffer dock**
This type of dock is reserved as intermediate buffer storage during unloading of transportation vehicles
	* **dispatch dock**
This type of dock is reserved for transportation vehicles for loading cargo 
	* **dispatch buffer dock**
This type of dock is reserved as intermediate buffer storage during loading to transportation vehicles
	* **storage dock** 
This type of dock is used for storing packages 

## Package management process

Packages are moved by warehouse package management process via execution of tasks that are collected in package management queue. 

### Package management queue

Example of package management queue is shown as table. 

Order|Task|
|---|---|
|1|task 1|
|2|task 2|
|...|...| 
|n|task n|

Package management process ensures tasks are executed in right order. Task execution process takes first task from queue and start the process of task execution. It waits for the task completion. After task completion the task is removed from the queue and next task in line is assign for execution.

```mermaid
graph  TD
A[Fetch first task]-->B[Begin execution]-->C{is task <br>completed?}
C-->|YES|D[remove task from queue]-->A
```
### Tasks
There are several type of tasks with specific functionalities.

### Receive task

Package is being received at *receive dock* (this is where transport stops to unload) and is moved to *receive buffer dock*. Task parameters are described in table
|Name|Description|
|---|---|
|package|id of package to be received by the warehouse|
|receive dock|id of dock where the transportation vehicle will wail for unloading of package|
|receive buffer dock|id of dock where robotic arm will move package when it is unloaded from the transportation vehicle

Process behind receiving task is described with flowchart
![image](https://i.ibb.co/3FgZrtS/receive-Task.jpg)

### Store task
Store task moves package from receive buffer dock to specific storing dock. Finding optimal storage dock is calculated by stacking algorithm.  Task parameters are described in table

|Name|Description|
|---|---|
|package|id of package to be moved to storage dock|
|receive buffer dock|id of dock where the package waits to be stored|
|stack type|type of stacking algorithm to calculate optimal storage dock

Store task process is described with flowchart

#### Stacking algorithm
Stacking algorithm calculates the optimal dock where the package will be stored. Optimal solution is based on certain criteria it can be simple like find the first empty dock or it can be more complex like minimizing storage time. 
Types of stacking algorithms are collected in a table
|Type| Description|
|---|---|
|FIRST|Find the first empty dock| 

### Swap task
Swap task moves package from source storage dock to target storing dock. This task is used to swap packages in order to optimize warehouse package management.  Task parameters are described in table

![image](https://i.ibb.co/Tqn1fdK/swapTask.jpg)


|Name|Description|
|---|---|
|package|id of package to be moved to target storage dock|
|source storage dock|id of dock where the package waits to be stored|
|stack type|type of stacking algorithm to calculate optimal storage dock

Store task process is described with flowchart

![image](https://i.ibb.co/xmXhHn9/store-Task.jpg)

### Unstore task

![image](https://i.ibb.co/gWp1rms/unstore-Task.jpg)
### Dispatch task

![image](https://i.ibb.co/jGXmqqg/dispatche-Task.jpg)

## Implementation

### Properties

|name|type|description|units
|---|---|---|---|
|operationalArea|struct| operating area of the robot|
|operationalArea.width|number|width of the operating area|mm
|operationalArea.length|number|length of the operating area|mm
|operationalArea.widthOffset|number|offset width of the operating area|mm
|operationalArea.lengthOffset|number|offset length the operating area|mm
|docks|array(dock)| list of docking areas|
|dock| struct| docking area structure|
|dock.id|id|id of a dock|
|dock.width| number|width of the docking area|mm
|dock.length| number|height of the docking area|mm
|dock.widthOffset|number|with offset center point of dock|mm
|dock.lengthOffset|number|length offset center point of dock|mm
|dock.maxPackage| number|maximum number of packages|count
|dock.type|RECEIVE, RECEIVE_BUFFER, STORE, DISPATCH_BUFFER, DISPATCH|definition of dock type 
|dock.loadingHeight |loading height of transportation vehicle
|package|struct|package physical properties structure|
|package.radio |number|radio of the package|mm
|package.height|number|height of the package|mm

### Variables
|name|type|description|units
|---|---|---|---|
|slots|array(slot)|array of all slots in a warehouse|
|slot|structure of slot|
|slot.dock|id|id of dock to which slot belongs|
|slot.level|number|level of a slot (at which height the slot lies)
|slot.package|id|package id if slot is occupied else empty
|state|IDLE,MOVING,STORING,UNSTORING|Current state of warehouse
|queue|array(tasks)|queue for package management process|


### Functions
|name|params|params|
|---|---|---|---|---|
