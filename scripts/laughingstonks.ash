// laughingstonks
// by VeeArr (#2045369)

script "laughingstonks";
notify "VeeArr";

int[11] FIXED_DROP_TURNS={1,2,4,7,11,16,22,29,37,46,56};
item[19] BASIC_FRUIT={$item[orange], $item[grapefruit], $item[grapes], $item[lemon], $item[lime], $item[papaya], $item[cranberries], $item[strawberry], $item[cherry], $item[kumquat], $item[tangerine], $item[raspberry], $item[kiwi], $item[blackberry], $item[banana], $item[cactus fruit], $item[plum], $item[pear], $item[peach]};
item[3] ADV_FRUIT={$item[classic banana], $item[antique watermelon], $item[quince]};

item[int] laughing_stock_drops(int class_id, int path_id, int daycount, int max_fights){
	item[int] rv;
	
	if(daycount>4){
		print("Portable Laughing Stock drops are not seeded beyond day 4.","red");
		return rv;
	}
	
	int pity_count=0;
	int pity_threshold=10;
	int fixed_ptr=0;
	
	for(int f=0;f<max_fights;f++) {
		int seed=class_id**3+84*path_id+123*(daycount-1)+381*f;
		rng r=php_seed(seed);
		boolean has_drop;
		if(f<=56) {
			if (FIXED_DROP_TURNS[fixed_ptr]==f) {
				has_drop=true;
				fixed_ptr++;
			} else {
				has_drop=false;
			}
		} else {
			has_drop=(php_mt_rand(r,1,50)==1);
		}
		if(!has_drop){ continue; }
		
		int adv_p=php_mt_rand(r,1,30);
		int threshold=3;
		if(pity_count<3) {
			threshold=pity_threshold;
		}
		boolean is_adv=(adv_p<=threshold);
		item fruit;
		if(is_adv) {
			pity_count++;
			pity_threshold=10;
			int idx=php_mt_rand(r,0,2);
			fruit=ADV_FRUIT[idx];
		} else {
			pity_threshold+=10;
			int idx=php_mt_rand(r,0,18);
			fruit=BASIC_FRUIT[idx];
		}

		rv[f]=fruit;
	}
	
	return rv;
}

item[int] laughing_stock_drops(class clazz, path the_path, int daycount, int max_fights){
	return laughing_stock_drops(clazz.id, the_path.id, daycount, max_fights);
}

void main(){
	item[int] results=laughing_stock_drops(my_class(), my_path(), my_daycount(), 500);
	foreach fight_num, drop in results {
		print(`{fight_num} {drop.name}`);
	}
}
