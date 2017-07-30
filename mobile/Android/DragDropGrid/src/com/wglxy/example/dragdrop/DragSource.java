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

import android.content.ClipData;
//import android.content.ClipDescription;
import android.view.View;

/**
 * This interface defines an object where drag-drop operations originate.
 *
 */
public interface DragSource {

/**
 * This method is called to determine if the DragSource has something to drag.
 * 
 * @return boolean - True if there is something to drag
 */

public boolean allowDrag ();

/**
 * Return the ClipData associated with the drag operation.
 * 
 * @return ClipData
 */

public ClipData clipDataForDragDrop ();

/**
 * Return the view that is the actual source of the information being dragged.
 * 
 * @return View
 */

public View dragDropView ();

/**
 * This method is called at the start of a drag-drop operation so the object being
 * dragged knows that it is being dragged.
 * 
 */

public void onDragStarted ();

/**
 * This method is called on the completion of the drag operation so the DragSource knows 
 * whether it succeeded or failed.
 * 
 * @param target DropTarget - the object that accepted the dragged object
 * @param success boolean - true means that the object was dropped successfully
 */

public void onDropCompleted (DropTarget target, boolean success);

} // end DragSource
