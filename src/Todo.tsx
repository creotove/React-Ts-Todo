import React, { KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react'

const Todo = () => {
    type Todo = {
        id: number,
        task: string,
        isCompleted: boolean
    }
    const ErrorTextBoxEmpty = "Please Enter A Todo"
    const ErrorLengthExceeded = "Sentence length should be less then 15 characters"
    const ErrorCannotDeleteNow = "Please cancel the update process or update the todo"

    const [todos, setTodos] = useState<Todo[]>([])
    const [text, setText] = useState<string>('')
    const [editMode, setEditMode] = useState<Boolean>(false)
    const [editableTodoId, setEditableTodoId] = useState<number>()

    const [errorText, setErrorText] = useState<string>('')
    const [errorOccured, setErrorOccured] = useState<boolean>(false)

    const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    // Todo : Dont know about HTMLInputElement


    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            addTodo(text);
        }
    };

    function addTodo(todo: string): void {
        if (!todo) {
            setErrorText(ErrorTextBoxEmpty)
            setErrorOccured(true)
            return
        }
        if (todo.length > 15) {
            setErrorText(ErrorLengthExceeded)
            setErrorOccured(true)
            return
        }
        setErrorText("")
        setErrorOccured(false)
        const newTodo: Todo = {
            id: todos.length,
            task: todo,
            isCompleted: false
        }
        setTodos([...todos, newTodo]);
        inputRef.current?.focus()
        setText("")
    }
    function deleteTodo(id: number): void {
        const newTodos: Todo[] = todos.filter((item) => {
            return id !== item.id
        })
        setTodos(newTodos)
    }
    function completeTodo(id: number): void {
        const updatedTodo: Todo[] = todos.map(todo => {
            if (todo.id === id)
                return {
                    ...todo,
                    isCompleted: !todo.isCompleted
                }
            return todo;
        }
        )
        setTodos(updatedTodo);
    };
    function updateTodo(id: number | undefined, updatedTask: string): void {
        if (!updatedTask) {
            setErrorOccured(true)
            setErrorText(ErrorTextBoxEmpty)
            return
        }
        setErrorOccured(false)
        setErrorText("")
        const updatedTodos: Todo[] = todos.map(todo => {
            if (todo.id === id) {
                return {
                    ...todo,
                    task: updatedTask,
                };
            }
            return todo;
        });
        setTodos(updatedTodos);
        setEditMode(false);
        setText("")
    };
    function handleEdit(id: number): void {
        setEditMode(true)
        setEditableTodoId(id)
        const editableTodo: Todo[] = todos.filter((item, idx) => {
            return item.id === id
        })
        setText(editableTodo[0].task)
        inputRef.current?.focus()
    }
    useEffect(() => {
        inputRef.current?.focus()
    }, [])
    return (
        <div className='w-96' onKeyDown={(e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                inputRef.current?.focus()
            }
        }}>
            <h1 className='text-3xl text-center whitespace-nowrap mb-3'>Todo List with TypeScript</h1>
            <div className="flex gap-x-5 justify-between mb-4">
                <input ref={inputRef} type="text"
                    className='rounded w-80 text-black ps-1'
                    placeholder='Enter todo..'
                    onKeyDown={handleKeyDown}
                    value={text}
                    onChange={(e) => {
                        if (text.length > 15) {
                            setErrorOccured(false)
                            setErrorText("")
                        }
                        if (errorText === ErrorTextBoxEmpty) {
                            setErrorOccured(false)
                            setErrorText("")
                        }

                        setText(e.target.value)
                    }} />
                {
                    editMode ? <button className='px-3 py-1 bg-green-700 font-semibold rounded' onClick={() => {
                        updateTodo(editableTodoId, text)
                        if (errorOccured) {
                            setErrorOccured(false)
                            setErrorText('')
                        }
                    }}>Update</button>
                        : <button className='px-3 py-1 bg-green-700 font-semibold rounded' onClick={() => {
                            addTodo(text)
                        }}>Add</button>
                }

            </div>
            {/* Error displat slot */}
            <p className="text-center bg-red-500 rounded text-white text-2xl mb-3">{errorOccured && errorText}</p>
            {/* todos display slot */}
            {
                todos && todos.length > 0 ? todos.map((todo, idx) => (
                    <div className="bg-zinc-800 flex justify-between rounded mb-2" key={idx}>
                        <div className="flex">
                            <input type="checkbox"
                                className='w-6'
                                checked={todo.isCompleted}
                                onChange={() => {
                                    completeTodo(todo.id)
                                }}
                            />
                            <p className={`text-2xl ps-3 ${todo.isCompleted ? 'line-through' : ''}`}>{todo.task}</p>
                        </div>
                        <div className="text-right" >
                            {
                                editMode ? editableTodoId === todo.id ? <button className='px-3 me-3 py-1 bg-blue-900 rounded'
                                    onClick={() => {
                                        setText("")
                                        setEditMode(false)
                                        setErrorOccured(false)
                                        setErrorText("")
                                    }}
                                >Cancel</button> : "" : <button className='px-3 me-3 py-1 bg-blue-900 rounded'
                                    onClick={() => {
                                        handleEdit(todo.id)
                                    }}
                                >Edit</button>
                            }

                            <button className='px-3 py-1 bg-red-900 rounded'
                                onClick={() => {
                                    if (editMode) {
                                        setErrorOccured(true)
                                        setErrorText(ErrorCannotDeleteNow)
                                        return
                                    }
                                    deleteTodo(todo.id)
                                }}
                            >Delete</button>
                        </div>
                    </div>
                )) : <p className='text-2xl text-red-500 text-center rounded bg-zinc-800'>No todos Available</p>
            }



        </div>
    )
}

export default Todo