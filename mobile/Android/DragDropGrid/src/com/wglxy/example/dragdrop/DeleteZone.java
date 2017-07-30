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

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

/**
 * This class represents an area where a dragged item can be dropped
 * in order to remove it from the screen.
 * It is a subclass of ImageView so it is easy to make the area appear as a trash icon or whatever
 * you like.
 *
 * <p> The default implementation assumes that the ImageView supports image levels.
 * Image level 1 is the normal view. Level 2 is for use when the DeleteZone has a dragged
 * object over it. To change that behavior, override methods onDragEnter and onDragExit.
 *
 */

public class DeleteZone extends ImageView
    implements DropTarget
{


/**
 */
// Constructors

public DeleteZone (Context context) {
   super  (context);
}
public DeleteZone (Context context, AttributeSet attrs) {
	super (context, attrs);
}
public DeleteZone (Context context, AttributeSet attrs, int style) 
{
	super (context, attrs, style);
}


/**
 */
// Instance Variables

private boolean mEnabled = true;

/**
 */
// DropTarget interface methods

/**
 * Return true if the DropTarget allows objects to be dropped on it.
 * 
 * @param source DragSource where the drag started
 * @return boolean True if the drop will be accepted, false otherwise.
 */

public boolean allowDrop (DragSource source) {
    return isEnabled ();
}

/**
 * Return the view that is the actual source of the information being dragged.
 * Since ImageCell implements the DragSource interface, it is the view itself.
 * 
 * @return View
 */

public View dragDropView () {
    return this;
}

/**
 * Handle an object being dropped on the DropTarget
 * 
 * @param source DragSource where the drag started
 */

public void onDrop (DragSource source) {
    if (isEnabled ()) {
       toast ("Moved to trash.");
       setImageLevel (1);
       invalidate ();
    }
}

/**
 * React to a dragged object entering into the view of the DropTarget.
 */    

public void onDragEnter (DragSource source) {
    // Set the image level so the image is highlighted;
    if (isEnabled ()) setImageLevel (2);
}

/**
 * React to a dragged object leaving the view of the DropTarget.
 */    

public void onDragExit (DragSource source) {
    if (isEnabled ()) setImageLevel (1);
}

/**
 */
// Methods

/**
 * Return true if this DeleteZone is enabled.
 * If it is, it means that it will accept dropped views.
 * 
 * @return boolean
 */

public boolean isEnabled ()
{
   return mEnabled && (getVisibility () == View.VISIBLE);
} // end getDragLayer

/**
 */
// More methods

/**
 * Show a string on the screen via Toast.
 * 
 * @param msg String
 * @return void
 */

public void toast (String msg)
{
    Toast.makeText (getContext (), msg, Toast.LENGTH_SHORT).show ();
} // end toast


} // end DeleteZone
