package com.stevano.blocky.dashboarddemo;



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
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.GridView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
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

    RelativeLayout dashboardLayout;
    DrawerLayout drawerLayout;
    AwesomeBar bar;
    //GridOverlayView gridOverlayView;
    GridView gridView;
    List<Block> blocks;

    NavigationView navigationView;
    NavigationView createWidgetView;
    DashboardAdapter dashboardAdapter;

    final private int BUILD_MODE = 0;
    final private int RUN_MODE = 1;

    private int dashboard_state;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_demo);
       setStatusBarTranslucent(true);

        gridView = (GridView) findViewById(R.id.dashboard_gridview);
        dashboardLayout = (RelativeLayout) findViewById(R.id.dashboardLayout);
        final int[] GridSize = getGridDimension();

        bar = (AwesomeBar) findViewById(R.id.bar);
         drawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);

        blocks = getDefaultListBlock();

        dashboardAdapter = new DashboardAdapter(this,blocks);
        gridView.setAdapter(dashboardAdapter);



        gridView.setVisibility(View.GONE);


        bar.addAction(R.drawable.ic_build, "Build");
        bar.animate();


       // bar.addAction(R.drawable.ic_run, "Run");

        dashboard_state = RUN_MODE;

        drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);



        bar.setActionItemClickListener(new AwesomeBar.ActionItemClickListener() {
            @Override
            public void onActionItemClicked(int position, ActionItem actionItem) {
                Toast.makeText(getBaseContext(), actionItem.getText()+" clicked", Toast.LENGTH_LONG).show();

                if (dashboard_state == RUN_MODE) {
                    bar.clearActions();

                    gridView.setVisibility(View.VISIBLE);
                    bar.addAction(R.drawable.ic_run, "Run");

                    drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED);
                    dashboard_state = BUILD_MODE;


                }
                else
                {
                    bar.clearActions();
                    gridView.setVisibility(View.GONE);
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



        // Drag Distance for Widget Box

        Field mDragger = null;//mRightDragger for right obviously
        try {
            mDragger = drawerLayout.getClass().getDeclaredField(
                    "mRightDragger");
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        mDragger.setAccessible(true);
        ViewDragHelper draggerObj = null;
        try {
            draggerObj = (ViewDragHelper) mDragger
                    .get(drawerLayout);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

        Field mEdgeSize = null;
        try {
            mEdgeSize = draggerObj.getClass().getDeclaredField(
                    "mEdgeSize");
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        mEdgeSize.setAccessible(true);
        int edge = 0;
        try {
            edge = mEdgeSize.getInt(draggerObj);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

        try {
            mEdgeSize.setInt(draggerObj, edge * 10);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }


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
//                                                                       btn.setWidth(GridSize[0] / 8);
//                                                                       btn.setHeight(GridSize[0] / 8);
                                                                       btn.setLayoutParams(new LinearLayout.LayoutParams( GridSize[0] / 4, GridSize[0] / 8));
                                                                       btn.setEnabled(true);
                                                                       gridView.addView(btn);
                                                                       dashboardLayout.addView(btn);
                                                                   } else if (id == R.id.create_text) {
                                                                       Toast.makeText(Dashboard.this, "Create Text", Toast.LENGTH_SHORT).show();
                                                                   } else if (id == R.id.create_switch) {
                                                                       Toast.makeText(Dashboard.this, "Create Switch", Toast.LENGTH_SHORT).show();
                                                                   }

                                                                   drawerLayout.closeDrawer(GravityCompat.END);
                                                                   return true;
                                                               }
                                                           });



        // Dashboard Layout Drag and Drop implement



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


    private  List<Block> getDefaultListBlock() {
        List<Block> list = new ArrayList<Block>();

        for (int j = 0; j < 16; j++)
        {
            for (int i = 0; i < 8; i++)
            {
                Block k = new Block(i,j,i + 8*j);
                list.add(k);
            }
        }



        return list;
    }

    private int[] getGridDimension(){
        DisplayMetrics dm = new DisplayMetrics();
        this.getWindowManager().getDefaultDisplay().getMetrics(dm);
        int width = dm.widthPixels;
        int height = dm.heightPixels;
        int dens = dm.densityDpi;
        double wi = (double)width / (double)dens;
        double hi = (double)height / (double)dens;
        double x = Math.pow(wi, 2);
        double y = Math.pow(hi, 2);
        double screenInches = Math.sqrt(x+y);

        int[] screenInformation = new int[2];
        screenInformation[0] = width;
        screenInformation[1] = height ;

        return screenInformation;
    }

}
