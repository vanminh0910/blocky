package com.wglxy.example.dragdrop;

/*
 * Copyright (C) 2013 Wglxy.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * (Note to other developers: The above note says you are free to do what you want with this code.
 *  Any problems are yours to fix. Wglxy.com is simply helping you get started. )
 */

/**
 * This is the interface that defines an object that implements a drag-drop operation.
 * Typically, this interface is implemented by an Activity or Fragment.
 * It is called a "Presenter" because it presents the drag-drop operation to the user.
 *
 */
public interface DragDropPresenter {

/**
 * This method is called to determine if drag-drop is enabled.
 * 
 * @return boolean
 */

public boolean isDragDropEnabled ();

/**
 * React to the start of a drag-drop operation.
 * 
 * @param source DragSource
 * @return void
 */

public void onDragStarted (DragSource source);

/**
 * This method is called on the completion of a drag operation.
 * If the drop was not successful, the target is null.
 * 
 * @param target DropTarget
 * @param success boolean - true means that the object was dropped successfully
 */

public void onDropCompleted (DropTarget target, boolean success);

} // end Interface
