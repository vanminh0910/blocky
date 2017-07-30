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
import android.content.Context;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.GridView;
import android.widget.ImageView;

/**
 * This subclass of ImageView is used to display an image on an GridView.
 * An ImageCell knows which cell on the grid it is showing and which grid it is attached to
 * Cell numbers are from 0 to NumCells-1.
 * It also knows if it is empty.
 *
 * <p> Image cells are places where images can be dragged from and dropped onto.
 * Therefore, this class implements both the DragSourceOLD and DropTargetOLD interfaces.
 * 
 */

public class ImageCell extends ImageView 
    implements DragSource, DropTarget
{
    public boolean mEmpty = true;
    public int mCellNumber = -1;
    public GridView mGrid;

/**
 */
// Constructors

public ImageCell (Context context) {
	super (context);
}
public ImageCell (Context context, AttributeSet attrs) {
	super (context, attrs);
}
public ImageCell (Context context, AttributeSet attrs, int style) {
	super (context, attrs, style);
}

/**
 */
// DragSource interface methods

/**
 * This method is called to determine if the DragSourceOLD has something to drag.
 * 
 * @return True if there is something to drag
 */

public boolean allowDrag () {
    // There is something to drag if the cell is not empty.
    return !mEmpty;
}

/**
 * Return the ClipData associated with the drag operation.
 * 
 * @return ClipData
 */

public ClipData clipDataForDragDrop () {
    return null;
    // eventually, create something with the id of the image and the cell number
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
 * This method is called at the start of a drag-drop operation so the object being
 * dragged knows that it is being dragged.
 * 
 */

public void onDragStarted () {
    // Change the cell a bit so the user can tell which cell they started with.
    if (mCellNumber >= 0) {
       setColorFilter (R.color.cell_nearly_empty);
       invalidate ();
       //setBackgroundResource (R.color.cell_empty);
    }
}

/**
 * This method is called on the completion of the drag operation so the DragSource knows 
 * whether it succeeded or failed.
 * 
 * @param target DropTarget - the object that accepted the dragged object
 * @param success boolean - true means that the object was dropped successfully
 */

public void onDropCompleted (DropTarget target, boolean success) {
    // Undo what we did in onDragStarted
    if (mCellNumber >= 0) {
       clearColorFilter ();
       invalidate ();
    }

    // If the drop succeeds, the image has moved elsewhere. 
    // So clear the image cell.

    if (success) {
       Log.d (DragActivity.LOG_NAME, "ImageCell.onDropCompleted - clearing source: " + mCellNumber);
       mEmpty = true;
       if (mCellNumber >= 0) {
          int bg = mEmpty ? R.color.cell_empty : R.color.cell_filled;
          setBackgroundResource (bg);
          setImageDrawable (null);
       } else {
         // If the cell number is negative, it means we are interacting with a free-standing
         // image cell. There is one of those. It is the place where an image is added when
         // the user clicks "add image".
         // At the conclusion of a drop, clear it.
         setImageResource (0);
       }
    } else {
      // On the failure case, reset the background color in case it is still set to the hover color.
      if (mCellNumber >=0) {
         int bg2 = mEmpty ? R.color.cell_empty : R.color.cell_filled;
         setBackgroundResource (bg2);
      }
    }

}

/**
 */
// DropTarget interface methods

/**
 * Return true if the DropTarget allows objects to be dropped on it.
 * Disallow drop if the source object is the same ImageCell.
 * Allow a drop of the ImageCell is empty
 * 
 * @param source DragSource where the drag started
 * @return boolean True if the drop will be accepted, false otherwise.
 */

public boolean allowDrop (DragSource source) {
    // Do not allow a drop if the DragSource is the same cell.
    if (source == this) return false;

    // An ImageCell accepts a drop if it is empty and if it is part of a grid.
    // A free-standing ImageCell does not accept drops.
    return mEmpty  && (mCellNumber >= 0);
}

/**
 * Handle an object being dropped on the DropTarget
 * 
 * @param source DragSource where the drag started
 */

public void onDrop (DragSource source) {
    Log.d (DragActivity.LOG_NAME, "ImageCell.onDrop: " + mCellNumber + " source: " + source);
        
    // Mark the cell so it is no longer empty.
    mEmpty = false;
    int bg = mEmpty ? R.color.cell_empty : R.color.cell_filled;
    setBackgroundResource (bg);

    // The view being dragged does not actually change its parent and switch over to the ImageCell.
    // What we do is copy the drawable from the source view.
    ImageView sourceView = (ImageView) source.dragDropView ();
    Drawable d = sourceView.getDrawable ();
    if (d != null) {
       this.setImageDrawable (d);
       this.invalidate ();
    } else {
      Log.e (DragActivity.LOG_NAME, "ImageCell.onDrop. Null Drawable");
    }

    // toast ("onDrop cell " + mCellNumber);
}

/**
 * React to a dragged object entering into the view of the DropTarget.
 */    

public void onDragEnter (DragSource source) {
    //Log.d (DragActivity.LOG_NAME, "ImageCell.onDragEnter: " + mCellNumber);
    if (mCellNumber < 0) return;
    int bg = mEmpty ? R.color.cell_empty_hover : R.color.cell_filled_hover;
    setBackgroundResource (bg);
}

/**
 * React to a dragged object leaving the view of the DropTarget.
 */    

public void onDragExit (DragSource source) {
    if (mCellNumber < 0) return;
    int bg = mEmpty ? R.color.cell_empty : R.color.cell_filled;
    setBackgroundResource (bg);
}

/**
 */
// Other Methods

/**
 * Return true if this cell is empty.
 * If it is, it means that it will accept dropped views.
 * It also means that there is nothing to drag.
 * 
 * @return boolean
 */

public boolean isEmpty ()
{
    return mEmpty;
}

/**
 * Call this view's onClick listener. Return true if it was called.
 * Clicks are ignored if the cell is empty.
 * 
 * @return boolean
 */

public boolean performClick ()
{
    if (!mEmpty) return super.performClick ();
    return false;
}

/**
 * Call this view's onLongClick listener. Return true if it was called.
 * Clicks are ignored if the cell is empty.
 * 
 * @return boolean
 */

public boolean performLongClick ()
{
    if (!mEmpty) return super.performLongClick ();
    return false;
}

} // end ImageCell
