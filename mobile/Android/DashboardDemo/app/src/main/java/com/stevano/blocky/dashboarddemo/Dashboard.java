package com.stevano.blocky.dashboarddemo;



import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.design.widget.CollapsingToolbarLayout;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.SwitchCompat;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewManager;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import com.github.florent37.awesomebar.ActionItem;
import com.github.florent37.awesomebar.AwesomeBar;
import com.stevano.blocky.dashboarddemo.Model.Widget;
import com.stevano.blocky.dashboarddemo.Model.WidgetEditBox;

import org.json.*;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;


/**
 * Created by stevenminh on 7/21/17.
 */

public class Dashboard extends AppCompatActivity

{


    int id = 0;
    public JSONArray DashboardList;
    final private int BUILD_MODE = 0;
    final private int RUN_MODE = 1;
    int[] gridItemSize;
    List<Widget> WidgetsList;
    RelativeLayout dashboardLayout;
    DrawerLayout drawerLayout;
    AwesomeBar bar;
    LayoutInflater layoutInflater;
    RelativeLayout.LayoutParams lParams;
    RelativeLayout.LayoutParams lParams_shadow;
//    List<Block> blocks;
    GridOverlayView gridOverlayView;
    NavigationView navigationView;
    NavigationView createWidgetView;
    RelativeLayout shadowView;
    RelativeLayout resizeView;
    EditText editText;
    private List<ViewGroup> gridItems;
    private boolean startDrag = false;
    private boolean finishDrag = false;
    private boolean enableResize = false;

    private int _yDelta;
    private int _xDelta;

    private int dashboard_state;
    WidgetEditBox editBox;

    View resize_top;
    View resize_bottom;
    View resize_left;
    View resize_right;



    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_demo);
        setStatusBarTranslucent(true);

        WidgetsList = new ArrayList<>();

        editBox = new WidgetEditBox(Dashboard.this);


        // gridView = (GridView) findViewById(R.id.dashboard_gridview);
        gridOverlayView = (GridOverlayView) findViewById(R.id.gridOverlayView);
        dashboardLayout = (RelativeLayout) findViewById(R.id.dashboardLayout);

        bar = (AwesomeBar) findViewById(R.id.bar);
        drawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        editText = (EditText) findViewById(R.id.dashboard_name);



//        editText.setFocusable(false);
//        blocks = getDefaultListBlock();

//        dashboardAdapter = new DashboardAdapter(this, blocks);
//        gridView.setAdapter(dashboardAdapter);
//
//
//        gridView.setVisibility(View.GONE);
        gridOverlayView.setVisibility(View.GONE);

        layoutInflater = LayoutInflater.from(Dashboard.this);

        gridItemSize = gridOverlayView.getGridItemWidth();

        bar.addAction(R.drawable.ic_build, "Build");
        bar.animate();
        editText.setEnabled(false);
        editText.setClickable(false);
        editText.setCursorVisible(false);

        editText.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if ( (actionId == EditorInfo.IME_ACTION_DONE) || ((event.getKeyCode() == KeyEvent.KEYCODE_ENTER) && (event.getAction() == KeyEvent.ACTION_DOWN ))) {

                    // Do stuff when user presses enter

//                    return true;

                    editText.setCursorVisible(false);
                }

                return false;
            }
        });

        editText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                editText.setCursorVisible(true);
            }
        });




        // bar.addAction(R.drawable.ic_run, "Run");

        dashboard_state = RUN_MODE;

        drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);


        bar.setActionItemClickListener(new AwesomeBar.ActionItemClickListener() {
            @Override
            public void onActionItemClicked(int position, ActionItem actionItem) {
                Toast.makeText(getBaseContext(), actionItem.getText() + " clicked", Toast.LENGTH_LONG).show();

               // Change to build mode
                if (dashboard_state == RUN_MODE) {
                    bar.clearActions();

                    editText.setEnabled(true);
                    editText.setClickable(true);

                    for(int i = 0; i< WidgetsList.size(); i++)
                    {
                        WidgetsList.get(i).getWidgetView().setEnabled(false);
                    }

//                    gridView.setVisibility(View.VISIBLE);

                    gridOverlayView.setVisibility(View.VISIBLE);
                    bar.addAction(R.drawable.ic_run, "Run");

                    drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED);
                    dashboard_state = BUILD_MODE;


                }
                // change to run mode
                else {
                    bar.clearActions();

                    editText.setEnabled(false);
                    editText.setClickable(false);
                    editText.setCursorVisible(false);
//                    gridView.setVisibility(View.GONE);


                    for(int i = 0; i< WidgetsList.size(); i++)
                    {
                        WidgetsList.get(i).getWidgetView().setEnabled(true);
                    }

                    gridOverlayView.setVisibility(View.GONE);
                    bar.addAction(R.drawable.ic_build, "Build");

                    drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                    dashboard_state = RUN_MODE;


                }

            }
        });

        bar.setOnMenuClickedListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                drawerLayout.openDrawer(Gravity.START);

            }
        });

        // bar.displayHomeAsUpEnabled(true);


//        // Drag Distance for Widget Box
//
//        Field mDragger = null;//mRightDragger for right obviously
//        try {
//            mDragger = drawerLayout.getClass().getDeclaredField(
//                    "mRightDragger");
//        } catch (NoSuchFieldException e) {
//            e.printStackTrace();
//        }
//        mDragger.setAccessible(true);
//        ViewDragHelper draggerObj = null;
//        try {
//            draggerObj = (ViewDragHelper) mDragger
//                    .get(drawerLayout);
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//        }
//
//        Field mEdgeSize = null;
//        try {
//            mEdgeSize = draggerObj.getClass().getDeclaredField(
//                    "mEdgeSize");
//        } catch (NoSuchFieldException e) {
//            e.printStackTrace();
//        }
//        mEdgeSize.setAccessible(true);
//        int edge = 0;
//        try {
//            edge = mEdgeSize.getInt(draggerObj);
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//        }
//
//        try {
//            mEdgeSize.setInt(draggerObj, edge * 5);
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//        }


        navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(new NavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(MenuItem item) {
                // Handle Left navigation view item clicks here.
                int id = item.getItemId();

                if (id == R.id.nav_camera) {
                    Toast.makeText(Dashboard.this, "Left Drawer - Import", Toast.LENGTH_SHORT).show();
                } else if (id == R.id.nav_gallery) {
                    Toast.makeText(Dashboard.this, "Left Drawer - Gallery", Toast.LENGTH_SHORT).show();
                } else if (id == R.id.nav_slideshow) {
                    Toast.makeText(Dashboard.this, "Left Drawer - Slideshow", Toast.LENGTH_SHORT).show();
                } else if (id == R.id.nav_manage) {
                    Toast.makeText(Dashboard.this, "Left Drawer - Tools", Toast.LENGTH_SHORT).show();
                } else if (id == R.id.nav_share) {
                    Toast.makeText(Dashboard.this, "Left Drawer - Share", Toast.LENGTH_SHORT).show();
                } else if (id == R.id.nav_send) {
                    Toast.makeText(Dashboard.this, "Left Drawer - Send", Toast.LENGTH_SHORT).show();
                }

                drawerLayout.closeDrawer(GravityCompat.START);
                return true;
            }
        });

        createWidgetView = (NavigationView) findViewById(R.id.create_widget_view);
        createWidgetView.setNavigationItemSelectedListener(new NavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(MenuItem item) {
                // Handle Left navigation view item clicks here.
                int id = item.getItemId();
//button
                if (id == R.id.create_button) {
                    RelativeLayout db_widget = (RelativeLayout) layoutInflater.inflate(R.layout.db_button,null,false);
                    db_widget.setLayoutParams(new RelativeLayout.LayoutParams(gridItemSize[1]*4,gridItemSize[0]*2));
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        db_widget.setElevation(2f);
                    }
                    db_widget.setOnLongClickListener(new WidgetOnLongClickListener());
                    db_widget.setOnTouchListener(new WidgetOnTouchListener());
                    TextView tv = db_widget.findViewById(R.id.db_title);
                    tv.setText("Example Button");
                    tv.setVisibility(View.VISIBLE);
                    Button btn = db_widget.findViewById(R.id.db_button);
                    btn.setVisibility(View.VISIBLE);

                    btn.setEnabled(false);


                    Widget temp = new Widget(id,"button","Example Button",btn, true, true);
                    db_widget.setTag(temp);

                    WidgetsList.add(temp);
                    id++;


                    dashboardLayout.addView(db_widget);
                }
//toggle button
                else if (id == R.id.create_togglebtn) {

                    RelativeLayout db_widget = (RelativeLayout) layoutInflater.inflate(R.layout.db_togglebutton,null,false);
                    db_widget.setLayoutParams(new RelativeLayout.LayoutParams(gridItemSize[1]*2,gridItemSize[0]*2));
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        db_widget.setElevation(2f);
                    }
                    db_widget.setOnLongClickListener(new WidgetOnLongClickListener());
                    db_widget.setOnTouchListener(new WidgetOnTouchListener());
                    TextView tv = db_widget.findViewById(R.id.db_title);
                    tv.setText("Example Toggle Button");
                    tv.setVisibility(View.VISIBLE);
                    ToggleButton btn = db_widget.findViewById(R.id.db_togglebtn);
                    btn.setVisibility(View.VISIBLE);

                    btn.setEnabled(false);

                    Widget temp = new Widget(id,"togglebtn","Example Toggle Button",btn, true, true);

                    db_widget.setTag(temp);
                    WidgetsList.add(temp);
                    id++;

                    dashboardLayout.addView(db_widget);

                }

                else if (id == R.id.create_text) {
                 //   Toast.makeText(Dashboard.this, "Create Text", Toast.LENGTH_SHORT).show();
                    // layoutInflater = LayoutInflater.from(Dashboard.this);
                    RelativeLayout db_widget = (RelativeLayout) layoutInflater.inflate(R.layout.db_label,null,false);
                    db_widget.setLayoutParams(new RelativeLayout.LayoutParams(gridItemSize[1]*2,gridItemSize[0]));
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        db_widget.setElevation(2f);
                    }
                    db_widget.setOnLongClickListener(new WidgetOnLongClickListener());
                    db_widget.setOnTouchListener(new WidgetOnTouchListener());
                    TextView tv = db_widget.findViewById(R.id.db_title);
                    tv.setText("Example Text");
                    tv.setVisibility(View.VISIBLE);
                    TextView btn = db_widget.findViewById(R.id.db_label);
                    btn.setVisibility(View.VISIBLE);

                    btn.setEnabled(false);

                    Widget temp = new Widget(id,"text","Example Text",btn,true, false);

                    db_widget.setTag(temp);
                    WidgetsList.add(temp);
                    id++;

                    dashboardLayout.addView(db_widget);

                } else if (id == R.id.create_slider) {
                   // Toast.makeText(Dashboard.this, "Create Switch", Toast.LENGTH_SHORT).show();
                  //   layoutInflater = LayoutInflater.from(Dashboard.this);
                    RelativeLayout db_widget = (RelativeLayout) layoutInflater.inflate(R.layout.db_slider,null,false);
                    db_widget.setLayoutParams(new RelativeLayout.LayoutParams(gridItemSize[1]*4,gridItemSize[0]*2));
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        db_widget.setElevation(2f);
                    }
                    db_widget.setOnLongClickListener(new WidgetOnLongClickListener());
                    db_widget.setOnTouchListener(new WidgetOnTouchListener());
                    TextView tv = db_widget.findViewById(R.id.db_title);
                    tv.setText("Example Slider");
                    tv.setVisibility(View.VISIBLE);
                    SeekBar btn = db_widget.findViewById(R.id.db_slider);
                    btn.setVisibility(View.VISIBLE);
                    final TextView value = db_widget.findViewById(R.id.db_slidevalue);
                    value.setText((Integer.toString(btn.getProgress())));
                    btn.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                        @Override
                        public void onProgressChanged(SeekBar seekBar, int i, boolean b) {
                            value.setText(Integer.toString(i));
                        }

                        @Override
                        public void onStartTrackingTouch(SeekBar seekBar) {

                        }

                        @Override
                        public void onStopTrackingTouch(SeekBar seekBar) {

                        }
                    });

                    btn.setEnabled(false);



                    Widget temp = new Widget(id,"switch","Example Switch",btn, true, false);

                    db_widget.setTag(temp);
                    WidgetsList.add(temp);
                    id++;


                    dashboardLayout.addView(db_widget);
                }

                drawerLayout.closeDrawer(GravityCompat.END);
                return true;
            }
        });


        // Dashboard Layout Drag and Drop implement


       // dashboardLayout.setOnDragListener(new MyDragListener());


    }


    @Override
    public void onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START);
        } else if (drawerLayout.isDrawerOpen(GravityCompat.END)) {  /*Closes the Appropriate Drawer*/
            drawerLayout.closeDrawer(GravityCompat.END);
        } else {
            super.onBackPressed();
            System.exit(0);
        }
    }

    protected void setStatusBarTranslucent(boolean makeTranslucent) {
        if (makeTranslucent) {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        } else {
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        }
    }


//    private List<Block> getDefaultListBlock() {
//        List<Block> list = new ArrayList<Block>();
//
//        for (int j = 0; j < 16; j++) {
//            for (int i = 0; i < 8; i++) {
//                Block k = new Block(i, j, i + 8 * j);
//                list.add(k);
//            }
//        }
//
//
//        return list;
//    }

    private int[] getGridDimension() {
        DisplayMetrics dm = new DisplayMetrics();
        this.getWindowManager().getDefaultDisplay().getMetrics(dm);
        int width = dm.widthPixels;
        int height = dm.heightPixels;
        int dens = dm.densityDpi;
        double wi = (double) width / (double) dens;
        double hi = (double) height / (double) dens;
        double x = Math.pow(wi, 2);
        double y = Math.pow(hi, 2);
        double screenInches = Math.sqrt(x + y);

        int[] screenInformation = new int[2];
        screenInformation[0] = width;
        screenInformation[1] = height;

        return screenInformation;
    }

    private void writeToFile(String data) {
        try {
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(openFileOutput("DashboardList.txt", Context.MODE_PRIVATE));
            outputStreamWriter.write(data);
            outputStreamWriter.close();
        }
        catch (IOException e) {
            Log.e("Exception", "File write failed: " + e.toString());
        }
    }

    private String readFromFile() {

        String ret = "";

        try {
            InputStream inputStream = openFileInput("DashboardList.txt");

            if ( inputStream != null ) {
                InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                String receiveString = "";
                StringBuilder stringBuilder = new StringBuilder();

                while ( (receiveString = bufferedReader.readLine()) != null ) {
                    stringBuilder.append(receiveString);
                }

                inputStream.close();
                ret = stringBuilder.toString();
            }
        }
        catch (FileNotFoundException e) {
            Log.e("login activity", "File not found: " + e.toString());
        } catch (IOException e) {
            Log.e("login activity", "Can not read file: " + e.toString());
        }

        return ret;
    }

    public int Round(int number, int roundfactor)
    {
        return (number/ roundfactor) * roundfactor;
    }

    private final class WidgetOnLongClickListener implements View.OnLongClickListener {
        public boolean onLongClick(View view) {

            lParams_shadow =  new RelativeLayout.LayoutParams(view.getLayoutParams());
            lParams = (RelativeLayout.LayoutParams) view.getLayoutParams();

            shadowView = (RelativeLayout) layoutInflater.inflate(R.layout.db_shadow,null,false);
            shadowView.setLayoutParams(lParams_shadow);
            shadowView.setAlpha(0.2f);
            shadowView.setBackgroundColor(Color.GREEN);
            shadowView.setVisibility(View.INVISIBLE);
            dashboardLayout.addView(shadowView);

            view.setAlpha(0.6f);

            startDrag = true;
                return true;

        }
    }

    public class WidgetOnTouchListener implements View.OnTouchListener {
        @Override
        public boolean onTouch(View view, MotionEvent event) {


    if(resizeView != null)
    {
        resizeView.setVisibility(View.INVISIBLE);
        
    }

            Widget currentWidget = (Widget) view.getTag();

                final int X = (int) event.getRawX();
                final int Y = (int) event.getRawY();
                int width = view.getLayoutParams().width;
                int height =  view.getLayoutParams().height;

                switch (event.getAction() & MotionEvent.ACTION_MASK) {
                    case MotionEvent.ACTION_DOWN:
                        lParams = (RelativeLayout.LayoutParams) view.getLayoutParams();
                        _xDelta = X - lParams.leftMargin;
                        _yDelta = Y - lParams.topMargin;

                        break;
                    case MotionEvent.ACTION_UP:
                        if (!startDrag)
                        {
                            Toast.makeText(Dashboard.this,"Edit Mode on " + currentWidget.getTitle()  ,Toast.LENGTH_LONG).show();
                            editBox.show();

                        }
if ((startDrag) && (finishDrag))  {
                        dashboardLayout.invalidate();
                        view.setLayoutParams(lParams_shadow);
                        view.setAlpha(1f);


    if (!enableResize) {

        resizeView = view.findViewById(R.id.Resize_layout);
        resizeView.setVisibility(View.VISIBLE);
        resize_left = view.findViewById(R.id.resize_left);
        resize_right = view.findViewById(R.id.resize_right);
        resize_top = view.findViewById(R.id.resize_top);
        resize_bottom = view.findViewById(R.id.resize_bottom);

        if (currentWidget.ishScroll())
        {
            resize_left.setVisibility(View.VISIBLE);
            resize_right.setVisibility(View.VISIBLE);
        }

        if (currentWidget.isvScroll())
        {
            resize_top.setVisibility(View.VISIBLE);
            resize_bottom.setVisibility(View.VISIBLE);
        }


    }
                    ((ViewManager) shadowView.getParent()).removeView(shadowView);
                    startDrag = false;
                    finishDrag = false;
                    //Toast.makeText(Dashboard.this, "X: " + Round((X - _xDelta + view.getWidth() / 4), gridItemSize[1])/gridItemSize[1] +  " -  Y: " + Round((Y - _yDelta + view.getHeight() / 4), gridItemSize[0])/gridItemSize[0] , Toast.LENGTH_SHORT).show();
                currentWidget.setX(Round((X - _xDelta + view.getWidth() / 4), gridItemSize[1])/gridItemSize[1]);
                currentWidget.setY(Round((Y - _yDelta + view.getHeight() / 4), gridItemSize[0])/gridItemSize[0]);


                                }
                if (!finishDrag)
                {
                    view.setAlpha(1f);
                }
                        break;
                    case MotionEvent.ACTION_POINTER_DOWN:
                        break;
                    case MotionEvent.ACTION_POINTER_UP:
                        break;
                    case MotionEvent.ACTION_MOVE:
if (startDrag) {
                            shadowView.setVisibility(View.VISIBLE);
                            lParams_shadow.topMargin = Round((Y - _yDelta + view.getHeight() / 4), gridItemSize[0]);
                            lParams_shadow.leftMargin = Round((X - _xDelta + view.getWidth() / 4), gridItemSize[1]);
                            shadowView.setLayoutParams(lParams_shadow);
                            lParams.topMargin = (Y - _yDelta);
                            lParams.leftMargin = (X - _xDelta);

                            view.setLayoutParams(lParams);
                        finishDrag = true;
                }
                        break;
                }

return false;


        }
    }



}
