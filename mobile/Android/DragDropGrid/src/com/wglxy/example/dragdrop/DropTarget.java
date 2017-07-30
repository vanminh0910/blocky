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

import android.view.View;

/**
 * This interface defines a view that allows objects to be dropped on it in a drag-drop operation.
 *
 */

public interface DropTarget {

/**
 * Return true if the DropTarget allows objects to be dropped on it.
 * 
 * @param source DragSource where the drag started
 * @return boolean True if the drop will be accepted, false otherwise.
 */

public boolean allowDrop (DragSource source);

/**
 * Return the view that is the actual target of the information being dragged.
 * 
 * @return View
 */

public View dragDropView ();

/**
 * Handle an object being dropped on the DropTarget
 * 
 * @param source DragSource where the drag started
 */

public void onDrop (DragSource source);

/**
 * React to a dragged object entering into the view of the DropTarget.
 */    

public void onDragEnter (DragSource source);

/**
 * React to a dragged object leaving the view of the DropTarget.
 */    

public void onDragExit (DragSource source);

}
