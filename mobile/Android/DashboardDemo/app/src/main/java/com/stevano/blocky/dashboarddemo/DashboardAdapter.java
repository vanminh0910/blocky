package com.stevano.blocky.dashboarddemo;

import android.content.Context;
import android.graphics.Color;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.DragEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.stevano.blocky.dashboarddemo.Model.Block;

import java.util.List;

/**
 * Created by stevenminh on 7/26/17.
 */

public class DashboardAdapter extends BaseAdapter {
    private Context mContext;
    private LayoutInflater layoutInflater;
    private List<Block> blocks;



    public DashboardAdapter(Context c, List<Block> blocks)
    {
        this.mContext = c;
        this.blocks = blocks;
        layoutInflater = LayoutInflater.from(c);
    }
    @Override

    public int getCount() {
        return blocks.size();
    }



    @Override
    public Block getItem(int i) {
        return blocks.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        ViewHolder holder;
        if( view == null ){
            //We must create a View:
            view = layoutInflater.inflate(R.layout.dashboard_blockitem, null);
            holder = new ViewHolder();
            holder.blockItem = (ImageView) view.findViewById(R.id.dashboard_block_iv);
            holder.RL = (RelativeLayout) view.findViewById(R.id.dashboard_block_layout);
            view.setTag(holder);
        }
        else
        {
            holder = (ViewHolder) view.getTag();
        }


        holder.blockItem.setImageResource(R.mipmap.block_off);
        holder.blockItem.setBackgroundColor(Color.parseColor("#414145"));
        holder.RL.setOnDragListener(new MyDragListener());


        //Here we can do changes to the convertView, such as set a text on a TextView
        //or an image on an ImageView.
        return view;
    }



    static class ViewHolder {
        RelativeLayout RL;
        ImageView blockItem;

    }
}

class MyDragListener implements View.OnDragListener {


    @Override
    public boolean onDrag(View v, DragEvent event) {
        int action = event.getAction();
        switch (event.getAction()) {
            case DragEvent.ACTION_DRAG_STARTED:
                // do nothing
                break;
            case DragEvent.ACTION_DRAG_ENTERED:
                v.setBackgroundColor(Color.WHITE);
                break;
            case DragEvent.ACTION_DRAG_EXITED:
                v.setBackgroundColor(ContextCompat.getColor(v.getContext(),R.color.colorBackground));
                break;
            case DragEvent.ACTION_DROP:
                // Dropped, reassign View to ViewGroup
                View view = (View) event.getLocalState();
                ViewGroup owner = (ViewGroup) view.getParent();
                owner.removeView(view);
                RelativeLayout container = (RelativeLayout) v;
                container.addView(view);
                container.setLayoutParams(new AbsListView.LayoutParams(AbsListView.LayoutParams.WRAP_CONTENT,AbsListView.LayoutParams.WRAP_CONTENT));
                view.setVisibility(View.VISIBLE);
                break;
            case DragEvent.ACTION_DRAG_ENDED:
                v.setBackgroundColor(Color.TRANSPARENT);
            default:
                break;
        }
        return true;
    }
}