package com.stevano.blocky.dashboarddemo;

import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;

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
            view.setTag(holder);
        }
        else
        {
            holder = (ViewHolder) view.getTag();
        }


        holder.blockItem.setImageResource(R.mipmap.block_off);
        holder.blockItem.setBackgroundColor(Color.parseColor("#414145"));


        //Here we can do changes to the convertView, such as set a text on a TextView
        //or an image on an ImageView.
        return view;
    }



    static class ViewHolder {
        ImageView blockItem;

    }
}
