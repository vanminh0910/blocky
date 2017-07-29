package com.stevano.blocky.dashboarddemo;



import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AppCompatActivity;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.GridView;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.github.florent37.awesomebar.ActionItem;
import com.github.florent37.awesomebar.AwesomeBar;
import com.stevano.blocky.dashboarddemo.Model.Block;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by stevenminh on 7/21/17.
 */

public class Dashboard extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener
{

    RelativeLayout dashboardLayout;
    DrawerLayout drawerLayout;
    AwesomeBar bar;
    //GridOverlayView gridOverlayView;
    GridView gridView;
    List<Block> blocks;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_demo);
       setStatusBarTranslucent(true);

        gridView = (GridView) findViewById(R.id.dashboard_gridview);
        dashboardLayout = (RelativeLayout) findViewById(R.id.dashboardLayout);
//gridOverlayView = (GridOverlayView) findViewById(R.id.gridOverlayView);
 bar = (AwesomeBar) findViewById(R.id.bar);
         drawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);

        blocks = getDefaultListBlock();

        gridView.setAdapter(new DashboardAdapter(this,blocks));




       // bar.addAction(R.drawable.ic_build, "Build");

        bar.addAction(R.drawable.ic_run, "Run");



        bar.setActionItemClickListener(new AwesomeBar.ActionItemClickListener() {
            @Override
            public void onActionItemClicked(int position, ActionItem actionItem) {
                Toast.makeText(getBaseContext(), actionItem.getText()+" clicked", Toast.LENGTH_LONG).show();
            }
        });

        bar.setOnMenuClickedListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                drawerLayout.openDrawer(Gravity.START);

            }
        });

       // bar.displayHomeAsUpEnabled(true);


        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        //gridOverlayView.setVisibility(View.INVISIBLE);

    }



    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_camera) {
            // Handle the camera action
        } else if (id == R.id.nav_gallery) {

        } else if (id == R.id.nav_slideshow) {

        } else if (id == R.id.nav_manage) {

        } else if (id == R.id.nav_share) {

        } else if (id == R.id.nav_send) {

        }

        drawerLayout.closeDrawer(GravityCompat.START);
        return true;
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

}
