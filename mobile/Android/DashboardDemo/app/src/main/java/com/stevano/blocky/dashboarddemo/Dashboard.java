package com.stevano.blocky.dashboarddemo;



import android.content.ClipData;
import android.content.ClipDescription;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v4.widget.ViewDragHelper;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.util.DisplayMetrics;
import android.view.DragEvent;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewManager;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.GridView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.github.florent37.awesomebar.ActionItem;
import com.github.florent37.awesomebar.AwesomeBar;
import com.stevano.blocky.dashboarddemo.Model.Block;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;


/**
 * Created by stevenminh on 7/21/17.
 */

public class Dashboard extends AppCompatActivity

{

    int[] gridItemSize;
    private List<ViewGroup> gridItems;



    private boolean startDrag = false;
    RelativeLayout dashboardLayout;
    DrawerLayout drawerLayout;
    AwesomeBar bar;
    LayoutInflater layoutInflater;

    RelativeLayout.LayoutParams lParams;
    RelativeLayout.LayoutParams lParams_shadow;
  //  GridView gridView;
    GridOverlayView gridOverlayView;
    List<Block> blocks;

    NavigationView navigationView;
    NavigationView createWidgetView;

    RelativeLayout shadowView;

    final private int BUILD_MODE = 0;
    final private int RUN_MODE = 1;

    private int _yDelta;
    private int _xDelta;

    private int dashboard_state;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_demo);
        setStatusBarTranslucent(true);


       // gridView = (GridView) findViewById(R.id.dashboard_gridview);
        gridOverlayView = (GridOverlayView) findViewById(R.id.gridOverlayView);
        dashboardLayout = (RelativeLayout) findViewById(R.id.dashboardLayout);
        final int[] GridSize = getGridDimension();

        bar = (AwesomeBar) findViewById(R.id.bar);
        drawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);

        blocks = getDefaultListBlock();

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


        // bar.addAction(R.drawable.ic_run, "Run");

        dashboard_state = RUN_MODE;

        drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);


        bar.setActionItemClickListener(new AwesomeBar.ActionItemClickListener() {
            @Override
            public void onActionItemClicked(int position, ActionItem actionItem) {
                Toast.makeText(getBaseContext(), actionItem.getText() + " clicked", Toast.LENGTH_LONG).show();

                if (dashboard_state == RUN_MODE) {
                    bar.clearActions();

//                    gridView.setVisibility(View.VISIBLE);

                    gridOverlayView.setVisibility(View.VISIBLE);
                    bar.addAction(R.drawable.ic_run, "Run");

                    drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED);
                    dashboard_state = BUILD_MODE;


                } else {
                    bar.clearActions();
//                    gridView.setVisibility(View.GONE);

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

                if (id == R.id.create_button) {
                    Toast.makeText(Dashboard.this, "Create Button", Toast.LENGTH_SHORT).show();
                    Button btn = new Button(Dashboard.this);
                    btn.setText("Click Me!");
                    btn.setLayoutParams(new LinearLayout.LayoutParams((GridSize[0] / 4), (GridSize[0] / 8)));
                    btn.setEnabled(true);
                    btn.setTag("BUTTON_DRAG");
                   // btn.setOnLongClickListener(new MyTouchListener());

                    dashboardLayout.addView(btn);
                } else if (id == R.id.create_text) {
                    Toast.makeText(Dashboard.this, "Create Text", Toast.LENGTH_SHORT).show();
                    // layoutInflater = LayoutInflater.from(Dashboard.this);
                    RelativeLayout db_btns = (RelativeLayout) layoutInflater.inflate(R.layout.db_button,null,false);
                    db_btns.setLayoutParams(new RelativeLayout.LayoutParams(gridItemSize[1]*2,gridItemSize[0]*2));
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        db_btns.setElevation(2f);
                    }
                    db_btns.setOnLongClickListener(new WidgetOnLongClickListener());
                    db_btns.setOnTouchListener(new WidgetOnTouchListener());
                    TextView tv = db_btns.findViewById(R.id.db_text);
                    tv.setText("Example Text");
                    tv.setVisibility(View.VISIBLE);
                    Button btn = db_btns.findViewById(R.id.db_button);
                    btn.setVisibility(View.VISIBLE);

                    dashboardLayout.addView(db_btns);
                } else if (id == R.id.create_switch) {
                    Toast.makeText(Dashboard.this, "Create Switch", Toast.LENGTH_SHORT).show();
                  //   layoutInflater = LayoutInflater.from(Dashboard.this);
                    RelativeLayout db_btn = (RelativeLayout) layoutInflater.inflate(R.layout.db_button,null,false);
                    db_btn.setLayoutParams(new RelativeLayout.LayoutParams(gridItemSize[1]*2,gridItemSize[0]*2));
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        db_btn.setElevation(2f);
                    }
                    db_btn.setOnLongClickListener(new WidgetOnLongClickListener());
                    db_btn.setOnTouchListener(new WidgetOnTouchListener());
                    TextView tv = db_btn.findViewById(R.id.db_text);
                    tv.setText("Example Switch");
                    tv.setVisibility(View.VISIBLE);
                    Button btn = db_btn.findViewById(R.id.db_button);
                    btn.setVisibility(View.VISIBLE);


                    dashboardLayout.addView(db_btn);
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


    private List<Block> getDefaultListBlock() {
        List<Block> list = new ArrayList<Block>();

        for (int j = 0; j < 16; j++) {
            for (int i = 0; i < 8; i++) {
                Block k = new Block(i, j, i + 8 * j);
                list.add(k);
            }
        }


        return list;
    }

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


    private final class WidgetOnLongClickListener implements View.OnLongClickListener {
        public boolean onLongClick(View view) {

            lParams_shadow =  new RelativeLayout.LayoutParams(view.getLayoutParams());
            lParams = (RelativeLayout.LayoutParams) view.getLayoutParams();

            shadowView = (RelativeLayout) layoutInflater.inflate(R.layout.db_button,null,false);
            shadowView.setLayoutParams(lParams_shadow);
            shadowView.setAlpha(0.2f);
            shadowView.setBackgroundColor(Color.GREEN);
            shadowView.setVisibility(View.INVISIBLE);
            dashboardLayout.addView(shadowView);


//
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
//                    view.startDragAndDrop(data, shadowBuilder, view, 0);
//                }
//                else {
//                    view.startDrag(data, shadowBuilder, view, 0);
//                }
//                view.setVisibility(View.INVISIBLE);

            startDrag = true;
                return true;

        }
    }

    public class WidgetOnTouchListener implements View.OnTouchListener {
        @Override
        public boolean onTouch(View view, MotionEvent event) {

            //if (startDrag) {
                view.setAlpha(0.6f);

                final int X = (int) event.getRawX();
                final int Y = (int) event.getRawY();

                switch (event.getAction() & MotionEvent.ACTION_MASK) {
                    case MotionEvent.ACTION_DOWN:
                        lParams = (RelativeLayout.LayoutParams) view.getLayoutParams();
                        _xDelta = X - lParams.leftMargin;
                        _yDelta = Y - lParams.topMargin;

                        break;
                    case MotionEvent.ACTION_UP:

                        dashboardLayout.invalidate();
                        view.setLayoutParams(lParams_shadow);
                        view.setAlpha(1f);
if (startDrag)
                        ((ViewManager) shadowView.getParent()).removeView(shadowView);
                        startDrag = false;
                        break;
                    case MotionEvent.ACTION_POINTER_DOWN:
                        break;
                    case MotionEvent.ACTION_POINTER_UP:
                        break;
                    case MotionEvent.ACTION_MOVE:
                        shadowView.setVisibility(View.VISIBLE);
                        lParams_shadow.topMargin = Round((Y - _yDelta + view.getHeight()/4), gridItemSize[0]);
                        lParams_shadow.leftMargin = Round((X - _xDelta + view.getWidth()/4 ), gridItemSize[1]);
                        shadowView.setLayoutParams(lParams_shadow);
                        lParams.topMargin = (Y - _yDelta);
                        lParams.leftMargin = (X - _xDelta );

                        view.setLayoutParams(lParams);
                        break;
                }

return false;
//                return false;
//            } else {
//                return false;
//            }

        }
    }



    private class MyDragListener implements View.OnDragListener {

        @Override
        public boolean onDrag(View v, DragEvent event) {

            View view = (View) event.getLocalState();

            switch (event.getAction()) {
                case DragEvent.ACTION_DRAG_STARTED:
                    lParams = (RelativeLayout.LayoutParams) view.getLayoutParams();
                    break;
                case DragEvent.ACTION_DRAG_ENTERED:


                    int x_cord = (int) event.getX();
                    int y_cord = (int) event.getY();

                    break;
                case DragEvent.ACTION_DRAG_EXITED:


                    ViewGroup.MarginLayoutParams marginParams = new ViewGroup.MarginLayoutParams(view.getLayoutParams());
                    x_cord = (int) event.getX() + v.getWidth()/2 + 100;
                    y_cord = (int) event.getY() + v.getHeight()/2;
                    marginParams.setMargins(x_cord, y_cord, 0, 0);
                    lParams = new RelativeLayout.LayoutParams(v.getWidth(), v.getHeight());


                    lParams.leftMargin = (int) (event.getX() - (v.getWidth() / 2));
                    lParams.topMargin = (int) (event.getY() - (v.getHeight()));


                    view.setLayoutParams(lParams);

//                    x_cord = (int) event.getX();
//                    y_cord = (int) event.getY();
//                    lParams.leftMargin = x_cord;
//                    lParams.topMargin = y_cord;
//
//                    view.setLayoutParams(lParams);

                    break;
                case DragEvent.ACTION_DROP:
                    // Dropped, reassign View to ViewGroup
                    view.setX(event.getX());
                    view.setY(event.getY());
                    ViewGroup owner = (ViewGroup) view.getParent();
                    owner.removeView(view);
                    RelativeLayout container = (RelativeLayout) v;
                    container.addView(view);
                    view.setVisibility(View.VISIBLE);
                    break;
                case DragEvent.ACTION_DRAG_ENDED:

                    break;
                default:
                    break;

            }

            return true;
        }
    }


    public int Round(int number, int roundfactor)
    {
        return (number/ roundfactor) * roundfactor;
    }



}
