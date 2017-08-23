package com.stevano.blocky.dashboarddemo.Model;

import android.view.View;
import android.widget.Switch;
import android.widget.TextView;

import info.hoang8f.widget.FButton;

/**
 * Created by stevenminh on 8/11/17.
 */

public class Widget {
    int id;
    int cols;
    int rows;
    int x;
    int y;
    String type;
    String title;
    View widgetView;
    String onswitchMess;
    String onswitchTopic;
    String offswitchMess;
    String offswitchTopic;
    String onclickMess;
    String onclickTopic;
    String labelMess;
    String labelTopic;

    public Boolean ishScroll() {
        return hScroll;
    }

    public void sethScroll(Boolean hScroll) {
        this.hScroll = hScroll;
    }

    public boolean isvScroll() {
        return vScroll;
    }

    public void setvScroll(boolean vScroll) {
        this.vScroll = vScroll;
    }

    boolean hScroll;
    boolean vScroll;


    public Widget(int id, String type, String title, View widgetView, boolean hScroll, boolean vScroll) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.widgetView = widgetView;
        this.hScroll = hScroll;
        this.vScroll = vScroll;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCols() {
        return cols;
    }

    public void setCols(int cols) {
        this.cols = cols;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public View getWidgetView() {
        return widgetView;
    }

    public void setWidgetView(View widgetView) {
        this.widgetView = widgetView;
    }

    public String getOnswitchMess() {
        return onswitchMess;
    }

    public void setOnswitchMess(String onswitchMess) {
        this.onswitchMess = onswitchMess;
    }

    public String getOnswitchTopic() {
        return onswitchTopic;
    }

    public void setOnswitchTopic(String onswitchTopic) {
        this.onswitchTopic = onswitchTopic;
    }

    public String getOffswitchMess() {
        return offswitchMess;
    }

    public void setOffswitchMess(String offswitchMess) {
        this.offswitchMess = offswitchMess;
    }

    public String getOffswitchTopic() {
        return offswitchTopic;
    }

    public void setOffswitchTopic(String offswitchTopic) {
        this.offswitchTopic = offswitchTopic;
    }

    public String getOnclickMess() {
        return onclickMess;
    }

    public void setOnclickMess(String onclickMess) {
        this.onclickMess = onclickMess;
    }

    public String getOnclickTopic() {
        return onclickTopic;
    }

    public void setOnclickTopic(String onclickTopic) {
        this.onclickTopic = onclickTopic;
    }

    public String getLabelMess() {
        return labelMess;
    }

    public void setLabelMess(String labelMess) {
        this.labelMess = labelMess;
    }

    public String getLabelTopic() {
        return labelTopic;
    }

    public void setLabelTopic(String labelTopic) {
        this.labelTopic = labelTopic;
    }




//    FButton btn;
//    Switch aSwitch;
//    TextView label;
//




}
