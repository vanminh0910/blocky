package com.stevano.blocky.dashboarddemo.Model;

/**
 * Created by stevenminh on 7/26/17.
 */

public class Block {
    int x;
    int y;
    int index;
    public Block(int x, int y, int index) {
        this.x = x;
        this.y = y;
        this.index = index;
    }



    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }
}
