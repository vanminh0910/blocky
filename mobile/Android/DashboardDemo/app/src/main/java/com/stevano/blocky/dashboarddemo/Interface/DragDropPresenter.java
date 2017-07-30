package com.stevano.blocky.dashboarddemo.Interface;

/**
 * Created by stevenminh on 7/30/17.
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
